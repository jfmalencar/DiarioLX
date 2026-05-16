package pt.ipl.diariolx.domain.content

import pt.ipl.diariolx.domain.media.MediaSummary

data class ContentBlock(
    val id: Int,
    val type: String,
    val content: String?,
    val media: MediaSummary?,
)
