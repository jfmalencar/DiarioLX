package pt.ipl.diariolx.http.dto.media

import pt.ipl.diariolx.domain.media.UploadType

data class SignedUrlRequestDTO(
    val credits: List<CreditDTO>,
    val contentType: String,
    val originalFileName: String,
    val altText: String,
    val uploadType: UploadType,
)
