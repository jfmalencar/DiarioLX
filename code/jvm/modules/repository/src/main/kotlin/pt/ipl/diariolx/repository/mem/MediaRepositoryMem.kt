package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.MediaCredit
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload
import pt.ipl.diariolx.repository.MediaRepository

class MediaRepositoryMem : MediaRepository {
    private val baseUrl = "http://localhost:8333"
    private val medias = mutableListOf<Media>()
    private var currentId = 0

    override fun create(upload: NewUpload): Int {
        val id = ++currentId
        val newMedia =
            Media(
                id = id,
                bucket = upload.bucket,
                objectKey = upload.objectKey,
                thumbnailObjectKey = null,
                altText = upload.altText,
                credits = upload.credits.map { MediaCredit(it.userId, "Photographer name", "PHOTOGRAPHER", "author") },
                mimeType = upload.contentType,
                status = "ready",
                sizeBytes = 0,
                createdAt = Clock.System.now(),
            )
        medias.add(newMedia)
        return id
    }

    override fun get(id: Int): Media? = medias.find { it.id == id }

    override fun getAll(
        limit: Int,
        offset: Int,
        type: String?,
    ): List<Media> = medias.drop(offset).take(limit)

    override fun completeUpload(media: NewMedia): Boolean {
        TODO("Not yet implemented")
    }
}
