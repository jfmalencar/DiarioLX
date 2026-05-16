package pt.ipl.diariolx.http.auth

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.problems.createProblemDetail

@Component
class AuthenticationInterceptor(
    private val authorizationHeaderProcessor: RequestTokenProcessor,
    private val objectMapper: ObjectMapper,
) : HandlerInterceptor {
    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
    ): Boolean {
        if (handler !is HandlerMethod) return true

        val requiredRole = handler.findMethodOrClassAnnotation<RequireRole>()
        val requiresLogin =
            requiredRole != null ||
                handler.methodParameters.any {
                    it.parameterType == AuthenticatedUser::class.java
                }

        if (requiresLogin) {
            val token = extractTokenFromCookies(request)

            val authUser =
                token?.let {
                    authorizationHeaderProcessor.processCookieToken(it)
                }

            if (authUser == null) {
                response.status = 401
                response.addHeader(NAME_WWW_AUTHENTICATE_HEADER, RequestTokenProcessor.SCHEME)
                return false
            }

            if (!authUser.user.active) {
                response.status = 403
                response.sendProblem(
                    objectMapper,
                    createProblemDetail(
                        type = "https://api.example.com/errors/deactivated-account",
                        title = "Deactivated account",
                        status = HttpStatus.FORBIDDEN,
                        detail = "The account associated with this user has been deactivated",
                        instance = request.requestURI,
                    ),
                )
                return false
            }

            if (requiredRole != null && authUser.user.role < requiredRole.value) {
                response.status = 403
                response.sendProblem(
                    objectMapper,
                    createProblemDetail(
                        type = "https://api.example.com/errors/forbidden",
                        title = "Forbidden",
                        status = HttpStatus.FORBIDDEN,
                        detail = "The account associated with this user does not have the required permission",
                        instance = request.requestURI,
                    ),
                )
                return false
            }

            AuthenticatedUserArgumentResolver.addUserTo(authUser, request)
            return true
        }

        return true
    }

    companion object {
        private const val NAME_WWW_AUTHENTICATE_HEADER = "WWW-Authenticate"
    }

    private fun extractTokenFromCookies(request: HttpServletRequest): String? =
        request.cookies
            ?.firstOrNull { it.name == "token" }
            ?.value
}
