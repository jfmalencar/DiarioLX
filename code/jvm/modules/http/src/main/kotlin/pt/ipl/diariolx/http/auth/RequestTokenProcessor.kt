package pt.ipl.diariolx.http.auth

import org.springframework.stereotype.Component
import pt.ipl.diariolx.domain.auth.JwtTokenInfo
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.services.UserService
import pt.ipl.diariolx.utils.token.JwtTokenGenerator

@Component
class RequestTokenProcessor(
    private val userService: UserService,
    private val tokenGenerator: JwtTokenGenerator,
) {
    fun processUser(
        id: Int,
        accessToken: String,
    ): AuthenticatedUser? =
        userService.getUserById(id)?.let {
            AuthenticatedUser(it, accessToken)
        }

    fun processCookieToken(token: String): JwtTokenInfo? = tokenGenerator.validateAccessToken(token)

    companion object {
        const val SCHEME = "Cookie"
    }
}
