package pt.ipl.diariolx.storage

import pt.ipl.diariolx.domain.media.StoredFile
import pt.ipl.diariolx.domain.media.StoredObjectInfo
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.HeadObjectRequest
import software.amazon.awssdk.services.s3.model.NoSuchKeyException
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest
import java.time.Duration

class S3FileStorage(
    private val s3Client: S3Client,
    private val s3PreSigner: S3Presigner,
) : FileStorage {
    override fun upload(
        bytes: ByteArray,
        bucket: String,
        objectName: String,
        contentType: String,
    ): StoredFile {
        val request =
            PutObjectRequest
                .builder()
                .bucket(bucket)
                .key(objectName)
                .contentType(contentType)
                .build()

        s3Client.putObject(
            request,
            RequestBody.fromBytes(bytes),
        )

        return StoredFile(
            objectName = objectName,
            url = getPath(bucket, objectName),
        )
    }

    override fun delete(
        bucket: String,
        objectName: String,
    ) {
        s3Client.deleteObject(
            DeleteObjectRequest
                .builder()
                .bucket(bucket)
                .key(objectName)
                .build(),
        )
    }

    override fun exists(
        bucket: String,
        objectName: String,
    ): Boolean =
        try {
            s3Client.headObject(
                HeadObjectRequest
                    .builder()
                    .bucket(bucket)
                    .key(objectName)
                    .build(),
            )
            true
        } catch (_: NoSuchKeyException) {
            false
        } catch (_: Exception) {
            false
        }

    override fun getObjectInfo(
        bucket: String,
        objectName: String,
    ): StoredObjectInfo? =
        try {
            val response =
                s3Client.headObject(
                    HeadObjectRequest
                        .builder()
                        .bucket(bucket)
                        .key(objectName)
                        .build(),
                )

            StoredObjectInfo(
                objectName = objectName,
                sizeBytes = response.contentLength(),
            )
        } catch (_: NoSuchKeyException) {
            null
        }

    override fun getUploadSignedUrl(
        bucket: String,
        objectName: String,
        contentType: String,
        expiresIn: Duration,
    ): String {
        val putObjectRequest =
            PutObjectRequest
                .builder()
                .bucket(bucket)
                .key(objectName)
                .contentType(contentType)
                .build()

        val presignRequest =
            PutObjectPresignRequest
                .builder()
                .signatureDuration(expiresIn)
                .putObjectRequest(putObjectRequest)
                .build()

        val presignedRequest =
            s3PreSigner.presignPutObject(presignRequest)

        return presignedRequest.url().toString()
    }

    override fun getPath(
        bucket: String,
        objectName: String,
    ) = "/$bucket/$objectName"
}
