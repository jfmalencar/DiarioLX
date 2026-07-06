package pt.ipl.diariolx.domain.auth

import kotlinx.datetime.Instant

data class Session(
    val userId: Int,
    val refreshToken: RefreshToken,
    val createdAt: Instant,
    val expiresAt: Instant,
)
