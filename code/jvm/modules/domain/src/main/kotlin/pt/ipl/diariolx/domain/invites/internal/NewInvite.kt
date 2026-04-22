package pt.ipl.diariolx.domain.invites.internal

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.UserRole

data class NewInvite(
    val invite: String,
    val role: UserRole,
    val createdAt: Instant,
    val expiresAt: Instant,
)
