package pt.ipl.diariolx.domain.media

import pt.ipl.diariolx.domain.author.Author

data class MediaSummary(
    val id: Int,
    val url: String,
    val thumbnailUrl: String? = null,
    val altText: String,
    val photographer: Author,
)
