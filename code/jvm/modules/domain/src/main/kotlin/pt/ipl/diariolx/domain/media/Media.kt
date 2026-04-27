package pt.ipl.diariolx.domain.media

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author

data class Media(
    val id: Int,
    val url: String,
    val thumbnailUrl: String? = null,
    val altText: String,
    val photographer: Author,
    val mimeType: String,
    val status: String,
    val sizeBytes: Long,
    val createdAt: Instant,
    val uploadedAt: Instant? = null,
)
