package pt.ipl.diariolx.http.dto.media

data class SignedUrlRequestDTO(
    val photographerId: Int,
    val contentType: String,
    val originalFileName: String,
    val altText: String,
)
