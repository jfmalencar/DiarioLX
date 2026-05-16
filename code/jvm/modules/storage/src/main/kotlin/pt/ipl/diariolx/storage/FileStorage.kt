package pt.ipl.diariolx.storage

import pt.ipl.diariolx.domain.media.StoredFile
import pt.ipl.diariolx.domain.media.StoredObjectInfo
import java.time.Duration

interface FileStorage {
    fun upload(
        bytes: ByteArray,
        objectName: String,
        contentType: String,
    ): StoredFile

    fun delete(objectName: String)

    fun exists(objectName: String): Boolean

    fun getUrl(objectName: String): String

    fun getObjectInfo(objectName: String): StoredObjectInfo?

    fun getUploadSignedUrl(
        objectName: String,
        contentType: String,
        expiresIn: Duration = Duration.ofMinutes(15),
    ): String
}
