package pt.ipl.diariolx.domain.media

data class NewUpload(
    val bucket: String,
    val objectName: String,
    val altText: String,
    val credits: List<Credit>,
    val originalFileName: String,
    val mimeType: String,
    val uploadType: UploadType,
)
