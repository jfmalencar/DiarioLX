package pt.ipl.diariolx.http.dto.auth

data class LoginResponseDTO(
    val token: String,
    val expiresAt: String,
)
