package pt.ipl.diariolx.http.dto.media

data class UserSignedUrlRequestDTO(
    val contentType: String,
    val originalFileName: String,
)
