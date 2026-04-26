package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload

class JdbiFileRepository(
    private val handle: Handle,
) : FileRepository {
    override fun create(upload: NewUpload): Int =
        handle
            .createQuery(
                """
                insert into media (type, original_file_name, bucket, object_key, alt_text, mime_type,status)
                values (:type, :original_file_name, :bucket, :object_key, :alt_text, :mime_type, :status)
                returning id
                """.trimIndent(),
            ).bind("type", "image")
            .bind("bucket", upload.bucket)
            .bind("original_file_name", upload.originalFileName)
            .bind("object_key", upload.objectKey)
            .bind("alt_text", upload.altText)
            .bind("mime_type", upload.contentType)
            .bind("status", "pending")
            .mapTo<Int>()
            .one()

    override fun getAll(
        page: Int,
        limit: Int,
    ): List<Media> =
        handle
            .createQuery("select * from media where status = :status")
            .bind("limit", limit)
            .bind("offset", (page - 1) * limit)
            .bind("status", "pending")
            .mapTo<MediaModel>()
            .list()
            .map { it.media }

    override fun completeUpload(media: NewMedia): Boolean =
        handle
            .createUpdate(
                """
                update media
                set status = :status, size_bytes = :size_bytes, uploaded_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
                """.trimIndent(),
            ).bind("id", media.id)
            .bind("status", "ready")
            .bind("size_bytes", media.sizeBytes)
            .execute() > 0

    private data class MediaModel(
        val id: Int,
        val type: String,
        val bucket: String,
        val objectKey: String,
        val thumbnailBucket: String?,
        val thumbnailObjectKey: String?,
        val originalFileName: String,
        val altText: String,
        val mimeType: String,
        val status: String,
        val sizeBytes: Long,
        val createdAt: Long,
        val uploadedAt: Long?,
    ) {
        val media: Media
            get() =
                Media(
                    id = id,
                    url = "http://localhost:8333/$bucket/$objectKey",
                    thumbnailUrl = thumbnailBucket?.let { "http://localhost:8333/$it/$thumbnailObjectKey" } ?: "",
                    altText = altText,
                    mimeType = mimeType,
                    status = status,
                    sizeBytes = sizeBytes,
                    photographer = Author(1, "Photographer name"),
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    uploadedAt = uploadedAt?.let { Instant.fromEpochSeconds(it) },
                )
    }
}
