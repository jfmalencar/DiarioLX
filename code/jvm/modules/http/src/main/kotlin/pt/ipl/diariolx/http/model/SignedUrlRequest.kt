package pt.ipl.diariolx.http.model

data class SignedUrlRequest(
    val photographerId: Int,
    val contentType: String,
    val originalFileName: String,
    val altText: String,
)
