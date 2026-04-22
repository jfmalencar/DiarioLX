package pt.ipl.diariolx.utils.token

data class LoginResultOutput(
    val tokenValue: String,
    val tokenExpiration: kotlinx.datetime.Instant,
)
