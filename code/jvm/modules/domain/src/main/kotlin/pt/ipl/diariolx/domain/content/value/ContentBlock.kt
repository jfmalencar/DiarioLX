package pt.ipl.diariolx.domain.content.value

import pt.ipl.diariolx.domain.media.MediaSummary

data class ContentBlock(
    val id: Int,
    val type: String,
    val content: String?,
    val media: MediaSummary?,
    val images: List<GalleryImage> = emptyList(),
)

data class GalleryImage(
    val media: MediaSummary,
    val caption: String?,
)
