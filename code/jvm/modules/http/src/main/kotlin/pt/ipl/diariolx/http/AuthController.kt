package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnTokenOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.auth.LoginResponseDTO
import pt.ipl.diariolx.http.dto.auth.LoginUserDTO
import pt.ipl.diariolx.http.dto.user.CreateUserRequestDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.UserService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
class AuthController(
    private val userService: UserService,
    private val logger: Logger,
) {
    @PostMapping(Uris.Auth.SIGNUP)
    @MayReturnCreated
    @MayReturnBadRequest
    fun register(
        @Parameter(hidden = true)invite: Invite,
        @RequestBody body: CreateUserRequestDTO,
    ): ResponseEntity<*> =
        when (val response = userService.create(body.username, body.email, body.password, body.fName, body.lName, invite)) {
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

    @PostMapping(Uris.Auth.LOGIN)
    @MayReturnTokenOk
    @MayReturnBadRequest
    fun login(
        @RequestBody body: LoginUserDTO,
        response: HttpServletResponse,
    ): ResponseEntity<*> =
        when (val result = userService.login(body.username, body.password)) {
            is Success -> {
                response.setHeader(HttpHeaders.SET_COOKIE, "token=${result.value.tokenValue}; HttpOnly; Path=/; Max-Age=86400")
                ResponseEntity.ok().body(
                    LoginResponseDTO(result.value.tokenValue, result.value.tokenExpiration.toString()),
                )
            }
            is Failure ->
                Problem.response(
                    result.value.toProblem(),
                    Uris.Auth.LOGIN,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PostMapping(Uris.Auth.LOGOUT)
    @MayReturnNoContent
    @MayReturnUnauthorized
    @MayReturnForbidden
    fun logout(
        @Parameter(hidden = true)me: AuthenticatedUser,
        response: HttpServletResponse,
    ): ResponseEntity<*> {
        userService.logout(me.token)
        response.setHeader(HttpHeaders.SET_COOKIE, "token=; Max-Age=0; Path=/; HttpOnly")
        return ResponseEntity.noContent().build<Unit>()
    }
}
