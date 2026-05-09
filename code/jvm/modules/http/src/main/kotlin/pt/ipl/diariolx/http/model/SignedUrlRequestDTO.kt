package pt.ipl.diariolx.http.model

data class SignedUrlRequestDTO(
    val photographerId: Int,
    val contentType: String,
    val originalFileName: String,
    val altText: String,
)
