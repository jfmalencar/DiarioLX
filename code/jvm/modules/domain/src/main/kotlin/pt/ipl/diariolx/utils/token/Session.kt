package pt.ipl.diariolx.utils.token

import kotlinx.datetime.Instant

data class Session(
    val sessionToken: SessionToken,
    val userId: Int,
    val createdAt: Instant,
    val lastUsedAt: Instant,
)
