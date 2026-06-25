package pt.ipl.diariolx.http.auth

import jakarta.servlet.http.HttpServletRequest
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer
import pt.ipl.diariolx.domain.auth.RefreshToken
import kotlin.jvm.java

@Component
class RefreshTokenArgumentResolver : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter) = parameter.parameterType == RefreshToken::class.java

    override fun resolveArgument(
        parameter: MethodParameter,
        mavContainer: ModelAndViewContainer?,
        webRequest: NativeWebRequest,
        binderFactory: WebDataBinderFactory?,
    ): Any? {
        val request =
            webRequest.getNativeRequest(HttpServletRequest::class.java)
                ?: throw IllegalStateException("TODO")
        return getRefreshTokenFrom(request)
    }

    companion object {
        private const val KEY = "RefreshTokenArgumentResolver"

        fun addRefreshTokenTo(
            refreshToken: String,
            request: HttpServletRequest,
        ) = request.setAttribute(KEY, refreshToken)

        fun getRefreshTokenFrom(request: HttpServletRequest): RefreshToken? =
            request.getAttribute(KEY)?.let {
                RefreshToken(it.toString())
            }
    }
}
