package pt.ipl.diariolx.domain.invites

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.UserRole

data class Invite(
    val id: Int,
    val invite: String,
    val role: UserRole,
    val createdAt: Instant,
    val expiresAt: Instant,
    val createdBy: Int? = null,
) {
    fun isValidAt(now: Instant) = now in createdAt..expiresAt
}
