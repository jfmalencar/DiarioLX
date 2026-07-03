package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload

interface MediaRepository {
    fun create(upload: NewUpload): Int

    fun get(id: Int): Media?

    fun getAll(
        limit: Int,
        offset: Int,
        type: String? = null,
        purpose: String?,
        query: String? = null,
    ): List<Media>

    fun delete(id: Int): Boolean

    fun completeUpload(media: NewMedia): Boolean
}
