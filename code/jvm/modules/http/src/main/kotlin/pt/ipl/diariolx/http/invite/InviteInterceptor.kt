package pt.ipl.diariolx.http.invite

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import pt.ipl.diariolx.domain.invites.Invite

@Component
class InviteInterceptor(
    private val inviteProcessor: InviteProcessor,
) : HandlerInterceptor {
    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
    ): Boolean {
        if (handler is HandlerMethod &&
            handler.methodParameters.any {
                it.parameterType == Invite::class.java
            }
        ) {
            val invite = inviteProcessor.processorInviteHeaderValue(request.getHeader(NAME_AUTHORIZATION_HEADER))
            return if (invite == null) {
                response.status = 403
                response.contentType = "application/problem+json"
                response.writer.write(
                    """
                    {
                      "type": "https://api.example.com/errors/invalid-invite-code",
                      "title": "Invalid Invite Code",
                      "status": 403,
                      "detail": "The provided invite code is invalid or expired.",
                      "instance": "${request.requestURI}",
                      "timestamp": ${System.currentTimeMillis()}
                    }
                    """.trimIndent(),
                )
                false
            } else {
                InviteArgumentResolver.addInviteTo(invite, request)
                true
            }
        }
        return true
    }

    companion object {
        const val NAME_AUTHORIZATION_HEADER = "Authorization"
        private const val NAME_WWW_AUTHENTICATE_HEADER = "WWW-Authenticate"
    }
}