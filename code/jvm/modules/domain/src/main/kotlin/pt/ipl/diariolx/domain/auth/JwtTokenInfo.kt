package pt.ipl.diariolx.domain.auth

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.UserRole

data class JwtTokenInfo(
    val userId: Int,
    val role: UserRole,
    val issuedAt: Instant,
    val expiration: Instant,
)
