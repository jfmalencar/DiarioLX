package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.media.Credit
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload
import pt.ipl.diariolx.domain.media.SignedUrlResponse
import pt.ipl.diariolx.domain.media.StoredFile
import pt.ipl.diariolx.domain.media.UploadType
import pt.ipl.diariolx.domain.media.UserSignedUrlResponse
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.storage.FileStorage
import pt.ipl.diariolx.utils.MediaSignedUrlResult
import pt.ipl.diariolx.utils.UserMediaSignedUrlResult
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success
import java.util.UUID

@Named
class MediaService(
    private val fileStorage: FileStorage,
    private val transactionManager: TransactionManager,
) {
    fun getSignedUrl(
        altText: String,
        credits: List<Credit>,
        contentType: String,
        originalFileName: String,
    ): MediaSignedUrlResult {
        val extension = originalFileName.substringAfterLast('.', "")
        val objectName = buildObjectName(extension = extension)
        val upload =
            NewUpload(
                "images",
                objectName,
                altText,
                credits,
                originalFileName,
                contentType,
            )

        val id =
            transactionManager.run {
                it.mediaRepository.create(upload)
            }
        val signedUrl = fileStorage.getUploadSignedUrl(objectName, upload.contentType)
        return success(SignedUrlResponse(id, signedUrl))
    }

    fun getUserSignedUrl(
        contentType: String,
        userId: Int,
    ): UserMediaSignedUrlResult {
        val objectName = buildObjectName(userId.toString(), UploadType.PROFILE_PICTURES)
        val signedUrl = fileStorage.getUploadSignedUrl(objectName, contentType)
        return success(UserSignedUrlResponse(signedUrl))
    }

    fun completeUpload(id: Int): Boolean {
        val media =
            transactionManager.run {
                return@run it.mediaRepository.get(id)
            } ?: return false
        val info = fileStorage.getObjectInfo(media.objectKey) ?: return false
        transactionManager.run {
            it.mediaRepository.completeUpload(NewMedia(id, info.sizeBytes))
        }
        return true
    }

    fun getAll(
        page: Int,
        size: Int,
        type: String?,
    ): PageResponse<Media> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                val type = type?.let { normalizeMimeTypeFilter(type) }
                it.mediaRepository.getAll(limit, offset, type)
            }
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

    private fun buildObjectName(
        id: String = UUID.randomUUID().toString(),
        uploadType: UploadType = UploadType.CONTENT_GALLERY,
        extension: String? = null,
    ): String =
        if (extension.isNullOrBlank()) {
            "${uploadType.path}/$id"
        } else {
            "${uploadType.path}/$id.$extension"
        }

    private fun normalizeMimeTypeFilter(type: String): String =
        when {
            type.endsWith("/*") -> type.removeSuffix("*")
            !type.contains("/") -> "$type/"
            else -> type
        }
}
