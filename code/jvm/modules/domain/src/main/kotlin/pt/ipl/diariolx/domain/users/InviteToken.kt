package pt.ipl.diariolx.domain.users

import java.sql.Timestamp

data class InviteToken(
    val id: Int,
    val token: String,
    val role: UserRole,
    val createdBy: Int,
    val createdAt: Timestamp,
    val expiresAt: Timestamp,
    val usedAt: Timestamp? = null,
    val usedByUserId: Int? = null,
)

