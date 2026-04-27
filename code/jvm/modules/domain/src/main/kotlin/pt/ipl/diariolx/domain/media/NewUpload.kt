package pt.ipl.diariolx.domain.media

data class NewUpload(
    val bucket: String,
    val objectKey: String,
    val altText: String,
    val photographerId: Int,
    val originalFileName: String,
    val contentType: String,
)
