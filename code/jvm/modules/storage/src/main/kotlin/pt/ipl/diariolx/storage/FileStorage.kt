package pt.ipl.diariolx.storage

import pt.ipl.diariolx.domain.media.StoredFile
import pt.ipl.diariolx.domain.media.StoredObjectInfo
import java.time.Duration

interface FileStorage {
    fun upload(
        bytes: ByteArray,
        bucket: String,
        objectName: String,
        contentType: String,
    ): StoredFile

    fun delete(
        bucket: String,
        objectName: String,
    )

    fun exists(
        bucket: String,
        objectName: String,
    ): Boolean

    fun getPath(
        bucket: String,
        objectName: String,
    ): String

    fun getObjectInfo(
        bucket: String,
        objectName: String,
    ): StoredObjectInfo?

    fun getUploadSignedUrl(
        bucket: String,
        objectName: String,
        contentType: String,
        expiresIn: Duration = Duration.ofMinutes(15),
    ): String
}
