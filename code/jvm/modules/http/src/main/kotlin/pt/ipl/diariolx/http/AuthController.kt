package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnTokenOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.dto.auth.LoginUserDTO
import pt.ipl.diariolx.http.dto.user.CreateUserRequestDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.InviteService
import pt.ipl.diariolx.services.UserService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Auth", description = "APIs for managing authentication")
class AuthController(
    private val userService: UserService,
    private val inviteService: InviteService,
    private val logger: Logger,
) {
    @PostMapping(Uris.Auth.SIGNUP)
    @MayReturnCreated
    @MayReturnBadRequest
    fun register(
        @RequestBody body: CreateUserRequestDTO,
    ): ResponseEntity<*> {
        val invite =
            inviteService.getInvite(body.inviteCode)?.let {
                Invite(it.id, it.invite, it.role, it.createdAt, it.expiresAt, it.used)
            }
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
                response.addHeader(
                    HttpHeaders.SET_COOKIE,
                    "accessToken=${result.value.accessToken}; HttpOnly; Path=/; Max-Age=600; SameSite=Strict",
                )
                response.addHeader(
                    HttpHeaders.SET_COOKIE,
                    "refreshToken=${result.value.refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict",
                )
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
        response.addHeader(HttpHeaders.SET_COOKIE, "accessToken=; Max-Age=0; Path=/; HttpOnly")
        response.addHeader(HttpHeaders.SET_COOKIE, "refreshToken=; Max-Age=0; Path=/; HttpOnly")
        return ResponseEntity.noContent().build<Unit>()
    }

    @PostMapping(Uris.Auth.REFRESH)
    @MayReturnNoContent
    @MayReturnUnauthorized
    fun refresh(
        @Parameter(hidden = true) refreshToken: RefreshToken,
        response: HttpServletResponse,
    ): ResponseEntity<*> =
        when (val result = userService.refresh(refreshToken)) {
            is Success -> {
                response.addHeader(
                    HttpHeaders.SET_COOKIE,
                    "accessToken=${result.value.accessToken}; HttpOnly; Path=/; Max-Age=600; SameSite=Strict",
                )
                ResponseEntity.noContent().build<Unit>()
            }
            is Failure ->
                Problem.response(
                    result.value.toProblem(),
                    Uris.Auth.REFRESH,
                )
        }
}
