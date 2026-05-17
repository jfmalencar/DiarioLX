package pt.ipl.diariolx.http.dto.media

data class SignedUrlRequestDTO(
    val credits: List<CreditDTO>,
    val contentType: String,
    val originalFileName: String,
    val altText: String,
)
