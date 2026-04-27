package pt.ipl.diariolx.storage

import pt.ipl.diariolx.domain.StoredFile
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

    fun getUploadSignedUrl(
        objectName: String,
        contentType: String,
        expiresIn: Duration = Duration.ofMinutes(15),
    ): String
}
