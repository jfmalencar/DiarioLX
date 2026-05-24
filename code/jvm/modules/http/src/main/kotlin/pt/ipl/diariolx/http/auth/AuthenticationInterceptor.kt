package pt.ipl.diariolx.http.auth

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import pt.ipl.diariolx.domain.auth.RefreshToken
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

        val requiresLogin =
            handler.hasMethodOrClassAnnotation<RequireRole>()

        val requireUser =
            handler.methodParameters.any {
                it.parameterType == AuthenticatedUser::class.java
            }

        val requireRefreshToken =
            handler.methodParameters.any {
                it.parameterType == RefreshToken::class.java
            }

        val (accessToken, refreshToken) = extractTokensFromCookies(request)
        val jwtInfo =
            accessToken?.let {
                authorizationHeaderProcessor.processCookieToken(it)
            }

        if (requiresLogin) {
            if (jwtInfo == null) {
                response.status = 401
                response.addHeader(NAME_WWW_AUTHENTICATE_HEADER, RequestTokenProcessor.SCHEME)
                return false
            }

            val requiredRole = handler.findMethodOrClassAnnotation<RequireRole>()
            if (requiredRole != null && jwtInfo.role < requiredRole.value) {
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
        }

        if (requireUser) {
            val authUser = jwtInfo?.let { authorizationHeaderProcessor.processUser(jwtInfo.userId, accessToken) }
            if (authUser == null) {
                response.status = 401
                response.sendProblem(
                    objectMapper,
                    createProblemDetail(
                        type = "https://api.example.com/errors/unauthorized",
                        title = "Unauthorized",
                        status = HttpStatus.UNAUTHORIZED,
                        detail = "The provided token is invalid or expired",
                        instance = request.requestURI,
                    ),
                )
                return false
            }
            AuthenticatedUserArgumentResolver.addUserTo(authUser, request)
        }
        if (requireRefreshToken && refreshToken != null) {
            RefreshTokenArgumentResolver.addRefreshTokenTo(refreshToken, request)
        }
        return true
    }

    companion object {
        private const val NAME_WWW_AUTHENTICATE_HEADER = "WWW-Authenticate"
    }

    private fun extractTokensFromCookies(request: HttpServletRequest): Pair<String?, String?> =
        Pair(
            request.cookies
                ?.firstOrNull { it.name == "accessToken" }
                ?.value,
            request.cookies
                ?.firstOrNull { it.name == "refreshToken" }
                ?.value,
        )
}
