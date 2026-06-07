package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.MediaCredit
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload
import pt.ipl.diariolx.repository.MediaRepository

class MediaRepositoryMem : MediaRepository {
    private val medias = mutableListOf<Media>()
    private var currentId = 0

    override fun create(upload: NewUpload): Int {
        val id = ++currentId
        val newMedia =
            Media(
                id = id,
                bucket = upload.bucket,
                objectKey = upload.objectName,
                thumbnailObjectKey = null,
                altText = upload.altText,
                credits = upload.credits.map { MediaCredit(it.userId, "Photographer name", "PHOTOGRAPHER", "author") },
                mimeType = upload.mimeType,
                status = "pending",
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
        purpose: String?,
    ): List<Media> = medias.filter { it.status === "ready" }.drop(offset).take(limit)

    override fun delete(id: Int): Boolean = medias.removeIf { it.id == id }

    override fun completeUpload(media: NewMedia): Boolean = true
}
