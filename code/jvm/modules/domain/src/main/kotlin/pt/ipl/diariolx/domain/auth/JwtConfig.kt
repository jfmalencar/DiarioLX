package pt.ipl.diariolx.domain.auth

data class JwtConfig(
    val secret: String = "",
    val accessTokenExpirationMs: Long = 600000, // 10 minutes
    val refreshTokenExpirationMs: Long = 604800000, // 7 days
)
