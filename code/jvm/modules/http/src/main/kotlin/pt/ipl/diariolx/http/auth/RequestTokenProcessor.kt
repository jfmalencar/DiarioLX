package pt.ipl.diariolx.http.auth

import org.springframework.stereotype.Component
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.services.UserServices

@Component
class RequestTokenProcessor(
    val usersService: UserServices,
) {
    fun processAuthorizationHeaderValue(authorizationValue: String?): AuthenticatedUser? {
        if (authorizationValue == null) {
            return null
        }
        val parts = authorizationValue.trim().split(" ")
        if (parts.size != 2) {
            return null
        }
        if (parts[0].lowercase() != SCHEME) {
            return null
        }
        return usersService.getUserByToken(parts[1])?.let {
            AuthenticatedUser(
                it,
                parts[1],
            )
        }
    }

    fun processCookieToken(token: String): AuthenticatedUser? =
        usersService.getUserByToken(token)?.let {
            AuthenticatedUser(it, token)
        }

    companion object {
        const val SCHEME = "bearer"
    }
}