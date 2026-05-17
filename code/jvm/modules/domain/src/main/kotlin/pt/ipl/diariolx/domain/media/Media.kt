package pt.ipl.diariolx.domain.media

import kotlinx.datetime.Instant

data class Media(
    val id: Int,
    val bucket: String,
    val objectKey: String,
    val thumbnailBucket: String? = null,
    val thumbnailObjectKey: String? = null,
    val altText: String,
    val credits: List<MediaCredit>,
    val mimeType: String,
    val status: String,
    val sizeBytes: Long,
    val createdAt: Instant,
    val uploadedAt: Instant? = null,
)
