package pt.ipl.diariolx.domain.media

data class NewUpload(
    val bucket: String,
    val objectKey: String,
    val altText: String,
    val credits: List<Credit>,
    val originalFileName: String,
    val contentType: String,
)
