package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.media.Buckets
import pt.ipl.diariolx.domain.media.Credit
import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.media.NewUpload
import pt.ipl.diariolx.domain.media.SignedUrl
import pt.ipl.diariolx.domain.media.StoredFile
import pt.ipl.diariolx.domain.media.UploadType
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.storage.FileStorage
import pt.ipl.diariolx.utils.MediaSignedUrlResult
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success
import java.util.UUID

@Named
class MediaService(
    private val fileStorage: FileStorage,
    private val transactionManager: TransactionManager,
    private val buckets: Buckets,
) {
    fun getSignedUrl(
        altText: String,
        credits: List<Credit> = listOf(),
        mimeType: String,
        originalFileName: String,
        uploadType: UploadType,
    ): MediaSignedUrlResult {
        val extension = originalFileName.substringAfterLast('.', "")
        val objectName = buildObjectName(uploadType = uploadType, extension = extension)
        val upload =
            NewUpload(
                buckets.public,
                objectName,
                altText,
                credits,
                originalFileName,
                mimeType,
                uploadType,
            )

        val id =
            transactionManager.run {
                it.mediaRepository.create(upload)
            }
        val signedUrl = fileStorage.getUploadSignedUrl(buckets.public, objectName, upload.mimeType)
        return success(SignedUrl(id, signedUrl))
    }

    fun completeUpload(id: Int): Boolean {
        val media =
            transactionManager.run {
                return@run it.mediaRepository.get(id)
            } ?: return false
        val info = fileStorage.getObjectInfo(media.bucket, media.objectKey) ?: return false
        transactionManager.run {
            it.mediaRepository.completeUpload(NewMedia(id, info.sizeBytes))
        }
        return true
    }

    fun getAll(
        page: Int,
        size: Int,
        type: String?,
        query: String? = null,
    ): PageResponse<Media> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                val type = type?.let { normalizeMimeTypeFilter(type) }
                val query = query?.takeIf { it.isNotBlank() }
                it.mediaRepository.getAll(limit, offset, type, "GALLERY", query)
            }
        }

    fun execute(
        bytes: ByteArray,
        originalFileName: String,
        contentType: String,
    ): StoredFile {
        val extension = originalFileName.substringAfterLast('.', "")
        val objectName = buildObjectName(uploadType = UploadType.CONTENT_IMAGES, extension = extension)
        return fileStorage.upload(
            bytes = bytes,
            bucket = buckets.public,
            objectName = objectName,
            contentType = contentType,
        )
    }

    private fun buildObjectName(
        id: String = UUID.randomUUID().toString(),
        uploadType: UploadType = UploadType.CONTENT_IMAGES,
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
