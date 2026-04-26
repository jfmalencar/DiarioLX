package pt.ipl.diariolx.storage

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.S3Configuration
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import java.net.URI

class FileStorageFactory {
    fun create(
        endpoint: String?,
        region: String,
        accessKey: String,
        secretKey: String,
        bucket: String,
        pathStyleAccess: Boolean,
    ): FileStorage {
        val credentials =
            StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey),
            )

        val s3Configuration =
            S3Configuration
                .builder()
                .pathStyleAccessEnabled(pathStyleAccess)
                .build()

        val s3ClientBuilder =
            S3Client
                .builder()
                .region(Region.of(region))
                .credentialsProvider(credentials)
                .serviceConfiguration(s3Configuration)

        val preSignerBuilder =
            S3Presigner
                .builder()
                .region(Region.of(region))
                .credentialsProvider(credentials)
                .serviceConfiguration(s3Configuration)

        if (!endpoint.isNullOrBlank()) {
            val uri = URI.create(endpoint)
            s3ClientBuilder.endpointOverride(uri)
            preSignerBuilder.endpointOverride(uri)
        }

        val client = s3ClientBuilder.build()
        val preSigner = preSignerBuilder.build()

        return S3FileStorage(
            s3Client = client,
            s3PreSigner = preSigner,
            bucket = bucket,
            publicEndpoint = endpoint ?: "",
        )
    }
}
