package pt.ipl.diariolx.http.dto.invite

data class CreateInviteResponseDTO(
    val invite: String,
    val expiresAt: String,
)
