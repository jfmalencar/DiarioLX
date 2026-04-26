package pt.ipl.diariolx.domain.article

import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.MediaSummary

data class ArticleBlock(
    val id: Int,
    val type: String,
    val content: String?,
    val media: MediaSummary?,
)
