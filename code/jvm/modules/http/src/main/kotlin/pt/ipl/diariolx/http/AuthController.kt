package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.auth.CookieConfig
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnOk
import pt.ipl.diariolx.http.annotations.MayReturnTokenOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.dto.auth.LoginUserDTO
import pt.ipl.diariolx.http.dto.user.CreateUserRequestDTO
import pt.ipl.diariolx.http.dto.user.passwordReset.CompleteResetDTO
import pt.ipl.diariolx.http.dto.user.passwordReset.ResetRequestDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.InviteService
import pt.ipl.diariolx.services.PasswordResetService
import pt.ipl.diariolx.services.UserService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Auth", description = "APIs for managing authentication")
class AuthController(
    private val userService: UserService,
    private val inviteService: InviteService,
    private val passwordResetService: PasswordResetService,
    private val logger: Logger,
    private val cookieConfig: CookieConfig,
) {
    private fun sessionCookie(
        name: String,
        value: String,
        maxAge: Long,
    ): String {
        val secure = if (cookieConfig.secure) "; Secure" else ""
        return "$name=$value; HttpOnly; Path=/; Max-Age=$maxAge; SameSite=Strict$secure"
    }

    @PostMapping(Uris.Auth.SIGNUP)
    @MayReturnCreated
    @MayReturnBadRequest
    fun register(
        @RequestBody body: CreateUserRequestDTO,
    ): ResponseEntity<*> {
        val invite = inviteService.getInvite(body.inviteCode)
        if (invite == null) {
            return Problem.response(
                Problem.invalidInvite,
                Uris.Auth.SIGNUP,
            )
        }
        return when (
            val response =
                userService.create(
                    body.username,
                    body.email,
                    body.password,
                    body.firstName,
                    body.lastName,
                    invite,
                )
        ) {
            is Success ->
                ResponseEntity
                    .created(Uris.Users.byId(response.value))
                    .build<Unit>()

            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Auth.SIGNUP,
                )
        }
    }

    @PostMapping(Uris.Auth.LOGIN)
    @MayReturnTokenOk
    @MayReturnBadRequest
    fun login(
        @RequestBody body: LoginUserDTO,
        response: HttpServletResponse,
    ): ResponseEntity<*> =
        when (val result = userService.login(body.username, body.password)) {
            is Success -> {
                response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("accessToken", result.value.accessToken, 600))
                response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("refreshToken", result.value.refreshToken, 604800))
                ResponseEntity.noContent().build<Unit>()
            }
            is Failure ->
                Problem.response(
                    result.value.toProblem(),
                    Uris.Auth.LOGIN,
                )
        }

    @PostMapping(Uris.Auth.LOGOUT)
    @MayReturnNoContent
    @MayReturnUnauthorized
    @MayReturnForbidden
    fun logout(
        @Parameter(hidden = true) refreshToken: RefreshToken?,
        response: HttpServletResponse,
    ): ResponseEntity<*> {
        if (refreshToken != null) {
            userService.logout(refreshToken)
        }
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("accessToken", "", 0))
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("refreshToken", "", 0))
        return ResponseEntity.noContent().build<Unit>()
    }

    @PostMapping(Uris.Auth.REFRESH)
    @MayReturnNoContent
    @MayReturnUnauthorized
    fun refresh(
        @Parameter(hidden = true) refreshToken: RefreshToken?,
        response: HttpServletResponse,
    ): ResponseEntity<*> =
        when (val result = userService.refresh(refreshToken)) {
            is Success -> {
                response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie("accessToken", result.value.accessToken, 600))
                ResponseEntity.noContent().build<Unit>()
            }
            is Failure ->
                Problem.response(
                    result.value.toProblem(),
                    Uris.Auth.REFRESH,
                )
        }

    @PostMapping(Uris.Auth.REQUEST_RESET)
    @MayReturnOk
    @MayReturnBadRequest
    fun requestPasswordReset(
        @RequestBody body: ResetRequestDTO,
    ): ResponseEntity<*> =
        when (val response = passwordResetService.create(body.username)) {
            is Success -> ResponseEntity.ok().build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Auth.REQUEST_RESET,
                )
        }

    @PatchMapping(Uris.Auth.COMPLETE)
    @MayReturnOk
    @MayReturnBadRequest
    @MayReturnUnauthorized
    fun completePasswordReset(
        @RequestBody body: CompleteResetDTO,
    ): ResponseEntity<*> =
        when (
            val response =
                passwordResetService.complete(
                    body.resetToken,
                    body.newPassword,
                )
        ) {
            is Success -> ResponseEntity.ok().build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Auth.COMPLETE,
                )
        }
}
