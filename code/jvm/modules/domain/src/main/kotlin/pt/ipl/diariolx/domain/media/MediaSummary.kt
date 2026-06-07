package pt.ipl.diariolx.domain.media

data class MediaSummary(
    val id: Int,
    val path: String,
    val thumbnailPath: String?,
    val altText: String?,
    val mimeType: String,
    val sizeBytes: Long,
    val credits: List<MediaCredit> = emptyList(),
)
