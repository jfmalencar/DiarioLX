package pt.ipl.diariolx.http.invite

import org.slf4j.Logger
import org.springframework.stereotype.Component
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.services.InviteServices

@Component
class InviteProcessor(
    val inviteService: InviteServices,
    val logger: Logger,
) {
    fun processorInviteHeaderValue(authorizationValue: String?): Invite? {
        if (authorizationValue == null) {
            return null
        }
        logger.info("Processing invite header value: $authorizationValue")
        val parts = authorizationValue.trim().split(" ")
        if (parts.size != 2) {
            return null
        }
        if (parts[0].lowercase() != SCHEME) {
            return null
        }
        return inviteService.getInvite(parts[1])?.let {
            Invite(it.id, it.invite, it.role, it.createdAt, it.expiresAt, it.used)
        }
    }

    companion object {
        const val SCHEME = "invite"
    }
}
