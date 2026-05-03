package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.StoredFile
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload
import pt.ipl.diariolx.domain.media.SignedUrlResponse
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.storage.FileStorage
import pt.ipl.diariolx.utils.MediaSignedUrlResult
import pt.ipl.diariolx.utils.success
import java.util.UUID

@Named
class FileService(
    private val fileStorage: FileStorage,
    private val transactionManager: TransactionManager,
) {
    fun getSignedUrl(
        altText: String,
        photographerId: Int,
        contentType: String,
        originalFileName: String,
    ): MediaSignedUrlResult {
        val extension = originalFileName.substringAfterLast('.', "")
        val objectName = buildObjectName(extension)
        val upload =
            NewUpload(
                "images",
                objectName,
                altText,
                photographerId,
                originalFileName,
                contentType,
            )

        val id =
            transactionManager.run {
                it.fileRepository.create(upload)
            }
        val signedUrl = fileStorage.getUploadSignedUrl(objectName, upload.contentType)
        return success(SignedUrlResponse(id, signedUrl))
    }

    fun completeUpload(id: Int): Boolean {
        val media =
            transactionManager.run {
                return@run it.fileRepository.get(id)
            }
        if (media == null) {
            return false
        }
        if (fileStorage.exists(media.url)) {
            transactionManager.run {
                it.fileRepository.completeUpload(NewMedia(id, 123))
            }
        }
        return true
    }

    fun getAll(
        page: Int,
        limit: Int,
    ): List<Media> =
        transactionManager.run {
            it.fileRepository.getAll(page, limit)
        }

    fun execute(
        bytes: ByteArray,
        originalFileName: String,
        contentType: String,
    ): StoredFile {
        val extension = originalFileName.substringAfterLast('.', "")
        val objectName = buildObjectName(extension)

        return fileStorage.upload(
            bytes = bytes,
            objectName = objectName,
            contentType = contentType,
        )
    }

    private fun buildObjectName(extension: String): String {
        val id = UUID.randomUUID()
        return if (extension.isBlank()) {
            "$id"
        } else {
            "$id.$extension"
        }
    }
}
