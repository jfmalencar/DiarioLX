package pt.ipl.diariolx.http.dto.media

import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.media.Media

data class MediaResponseDTO(
    val id: Int,
    val url: String,
    val thumbnailUrl: String? = null,
    val altText: String,
    val photographer: Author,
    val mimeType: String,
    val sizeBytes: Long,
    val createdAt: String,
    val uploadedAt: String? = null,
) {
    companion object {
        fun from(media: Media): MediaResponseDTO =
            MediaResponseDTO(
                id = media.id,
                url = "http://localhost:8333/${media.bucket}/${media.objectKey}",
                thumbnailUrl = "http://localhost:8333/${media.thumbnailBucket}/${media.thumbnailObjectKey}",
                altText = media.altText,
                photographer = media.photographer,
                mimeType = media.mimeType,
                sizeBytes = media.sizeBytes,
                createdAt = media.createdAt.toString(),
                uploadedAt = media.uploadedAt?.toString(),
            )
    }
}
