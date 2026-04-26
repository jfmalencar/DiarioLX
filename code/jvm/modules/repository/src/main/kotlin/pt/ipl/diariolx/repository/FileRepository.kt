package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload

interface FileRepository {
    fun create(upload: NewUpload): Int

    fun getAll(
        page: Int,
        limit: Int,
    ): List<Media>

    fun completeUpload(media: NewMedia): Boolean
}
