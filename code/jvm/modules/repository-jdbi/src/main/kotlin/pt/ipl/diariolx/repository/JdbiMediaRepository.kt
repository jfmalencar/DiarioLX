package pt.ipl.diariolx.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.media.Credit
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload

class JdbiMediaRepository(
    private val handle: Handle,
) : MediaRepository {
    override fun create(upload: NewUpload): Int {
        val mediaId =
            handle
                .createQuery(
                    """
                    insert into medias (purpose, original_file_name, bucket, object_key, thumbnail_bucket, thumbnail_object_key,alt_text, mime_type,status)
                    values (:purpose::media_purpose, :original_file_name, :bucket, :object_key, :bucket, :object_key, :alt_text, :mime_type, :status)
                    returning id
                    """.trimIndent(),
                ).bind("purpose", upload.uploadType.purpose)
                .bind("bucket", upload.bucket)
                .bind("original_file_name", upload.originalFileName)
                .bind("object_key", upload.objectName)
                .bind("alt_text", upload.altText)
                .bind("mime_type", upload.mimeType)
                .bind("status", "pending")
                .mapTo<Int>()
                .one()

        insertCredits(mediaId, upload.credits)
        return mediaId
    }

    override fun getAll(
        limit: Int,
        offset: Int,
        type: String?,
        purpose: String?,
        query: String?,
    ): List<Media> {
        val sql =
            buildString {
                append("select * from v_medias where status = :status")
                if (type != null) {
                    append(" AND mime_type ILIKE :type")
                }
                if (purpose != null) {
                    append(" AND purpose = :purpose::media_purpose")
                }
                if (query != null) {
                    append(" AND (original_file_name ILIKE :query OR alt_text ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }

        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", offset)
            .bind("type", "$type%")
            .bind("status", "ready")
            .bind("purpose", purpose)
            .bind("query", query?.let { "%$it%" })
            .mapTo<MediaModel>()
            .list()
            .map { it.media }
    }

    override fun get(id: Int): Media? {
        handle
            .createQuery("select * from v_medias where id = :id")
            .bind("id", id)
            .mapTo<MediaModel>()
            .singleOrNull()
            ?.let { return it.media }
        return null
    }

    override fun completeUpload(media: NewMedia): Boolean =
        handle
            .createUpdate(
                """
                update medias
                set status = :status, size_bytes = :size_bytes, uploaded_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
                """.trimIndent(),
            ).bind("id", media.id)
            .bind("status", "ready")
            .bind("size_bytes", media.sizeBytes)
            .execute() > 0

    override fun delete(id: Int): Boolean =
        handle
            .createUpdate("delete from medias where id = :id")
            .bind("id", id)
            .execute() > 0

    private fun insertCredits(
        mediaId: Int,
        credits: List<Credit>,
    ) {
        if (credits.isEmpty()) return
        val batch =
            handle.prepareBatch(
                """
                insert into media_credits (media_id, user_id, role)
                values (:media_id, :user_id, :role::credit_role)
                """.trimIndent(),
            )

        credits.forEach { user ->
            batch
                .bind("media_id", mediaId)
                .bind("user_id", user.userId)
                .bind("role", user.role.name)
                .add()
        }

        batch.execute()
    }

    private data class MediaModel(
        val id: Int,
        val purpose: String,
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
        val credits: String,
    ) {
        private inline fun <reified T> parseJson(json: String): T {
            val objectMapper = ObjectMapper().registerKotlinModule()
            return objectMapper.readValue(json)
        }

        val media: Media
            get() =
                Media(
                    id = id,
                    bucket = bucket,
                    objectKey = objectKey,
                    thumbnailBucket = thumbnailBucket,
                    thumbnailObjectKey = thumbnailObjectKey,
                    altText = altText,
                    mimeType = mimeType,
                    status = status,
                    sizeBytes = sizeBytes,
                    credits = parseJson(credits),
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    uploadedAt = uploadedAt?.let { Instant.fromEpochSeconds(it) },
                )
    }
}
