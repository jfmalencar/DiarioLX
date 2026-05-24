package pt.ipl.diariolx.domain.auth

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.auth.RefreshToken

data class Session(
    val userId: Int,
    val refreshToken: RefreshToken,
    val createdAt: Instant,
    val expiresAt: Instant,
)
