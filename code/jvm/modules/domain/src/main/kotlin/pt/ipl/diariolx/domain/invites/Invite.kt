package pt.ipl.diariolx.domain.invites

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.UserRole
import kotlin.time.Duration

data class Invite(
    val id: Int,
    val invite: String,
    val role: UserRole,
    val createdAt: Instant,
    val expiresAt: Instant,
    val used: Boolean,
)
