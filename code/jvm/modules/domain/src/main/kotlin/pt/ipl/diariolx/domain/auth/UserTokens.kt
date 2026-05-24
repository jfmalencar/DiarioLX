package pt.ipl.diariolx.domain.auth

data class UserTokens(
    val accessToken: String,
    val refreshToken: String,
)
