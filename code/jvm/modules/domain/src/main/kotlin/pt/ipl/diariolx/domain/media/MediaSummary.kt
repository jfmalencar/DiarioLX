package pt.ipl.diariolx.domain.media

data class MediaSummary(
    val id: Int,
    val url: String,
    val thumbnailUrl: String?,
    val altText: String?,
    val mimeType: String,
    val sizeBytes: Long,
    val credits: List<MediaCredit> = emptyList(),
)
