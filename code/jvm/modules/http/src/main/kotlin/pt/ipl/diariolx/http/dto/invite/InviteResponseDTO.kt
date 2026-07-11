package pt.ipl.diariolx.http.dto.invite

import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.users.UserRole

data class InviteResponseDTO(
    val id: Int,
    val invite: String,
    val createdAt: String,
    val expiresAt: String,
    val role: UserRole,
    val createdBy: Int?,
) {
    companion object {
        fun from(invite: Invite) =
            InviteResponseDTO(
                id = invite.id,
                invite = invite.invite,
                createdAt = invite.createdAt.toString(),
                expiresAt = invite.expiresAt.toString(),
                role = invite.role,
                createdBy = invite.createdBy,
            )
    }
}
