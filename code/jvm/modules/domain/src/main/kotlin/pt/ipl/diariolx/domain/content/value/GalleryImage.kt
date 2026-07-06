package pt.ipl.diariolx.domain.content.value

import pt.ipl.diariolx.domain.media.MediaSummary

data class GalleryImage(
    val media: MediaSummary,
    val caption: String?,
)
