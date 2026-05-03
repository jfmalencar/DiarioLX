package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload
import pt.ipl.diariolx.repository.FileRepository

class FileRepositoryMem : FileRepository {
    private val baseUrl = "http://localhost:8333"
    private val medias = mutableListOf<Media>()
    private var currentId = 0

    override fun create(upload: NewUpload): Int {
        val id = ++currentId
        val newMedia =
            Media(
                id = id,
                url = "$baseUrl/${upload.bucket}/${upload.objectKey}",
                thumbnailUrl = null,
                altText = upload.altText,
                photographer = Author(upload.photographerId, "Photographer name"),
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
        page: Int,
        limit: Int,
    ): List<Media> = medias

    override fun completeUpload(media: NewMedia): Boolean {
        TODO("Not yet implemented")
    }
}
