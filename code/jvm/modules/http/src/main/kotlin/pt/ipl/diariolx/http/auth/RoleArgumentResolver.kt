package pt.ipl.diariolx.http.auth

import jakarta.servlet.http.HttpServletRequest
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer
import pt.ipl.diariolx.domain.users.UserRole
import kotlin.jvm.java

@Component
class RoleArgumentResolver : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter) = parameter.parameterType == UserRole::class.java

    override fun resolveArgument(
        parameter: MethodParameter,
        mavContainer: ModelAndViewContainer?,
        webRequest: NativeWebRequest,
        binderFactory: WebDataBinderFactory?,
    ): Any? {
        val request =
            webRequest.getNativeRequest(HttpServletRequest::class.java)
                ?: throw IllegalStateException("TODO")
        return getUserRoleFrom(request)
    }

    companion object {
        private const val KEY = "UserRoleArgumentResolver"

        fun addUserRoleTo(
            userRole: UserRole,
            request: HttpServletRequest,
        ) = request.setAttribute(KEY, userRole.name)

        fun getUserRoleFrom(request: HttpServletRequest): UserRole? =
            request.getAttribute(KEY)?.let {
                UserRole.valueOf(it.toString())
            }
    }
}
