package pt.ipl.diariolx.http.model

import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.media.Media

data class MediaResponse(
    val id: Int,
    val url: String,
    val thumbnailUrl: String? = null,
    val altText: String,
    val photographer: Author,
    val mimeType: String,
    val status: String,
    val sizeBytes: Long,
    val createdAt: String,
    val uploadedAt: String? = null,
) {
    companion object {
        fun from(media: Media): MediaResponse =
            MediaResponse(
                id = media.id,
                url = media.url,
                thumbnailUrl = media.thumbnailUrl,
                altText = media.altText,
                photographer = media.photographer,
                mimeType = media.mimeType,
                status = media.status,
                sizeBytes = media.sizeBytes,
                createdAt = media.createdAt.toString(),
                uploadedAt = media.uploadedAt?.toString(),
            )
    }
}
