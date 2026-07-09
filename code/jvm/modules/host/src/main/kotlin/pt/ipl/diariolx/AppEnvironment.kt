package pt.ipl.diariolx

import org.springframework.core.env.Environment
import org.springframework.stereotype.Component

@Component
class AppEnvironment(
    private val environment: Environment,
) {
    // Database
    val dbUrl: String get() =
        "jdbc:postgresql://${environment.getProperty(
            "POSTGRES_HOST",
        )}:${environment.getProperty(
            "POSTGRES_PORT",
        )}/${environment.getProperty(
            "POSTGRES_DB",
        )}?user=${environment.getProperty("POSTGRES_USER")}&password=${environment.getProperty("POSTGRES_PASSWORD")}"

    // Storage
    val s3Endpoint: String get() = environment.getProperty("S3_ENDPOINT", "http://localhost:8333")
    val s3PublicEndpoint: String get() = environment.getProperty("S3_PUBLIC_ENDPOINT", "http://localhost:8333")
    val s3Region: String get() = environment.getProperty("S3_REGION", "us-east-1")
    val s3AccessKey: String get() = environment.getRequiredProperty("S3_ACCESS_KEY")
    val s3SecretKey: String get() = environment.getRequiredProperty("S3_SECRET_KEY")
    val s3PublicBucket: String get() = environment.getProperty("S3_BUCKET", "media")
    val s3PathStyleAccess: Boolean get() = environment.getProperty("S3_PATH_STYLE_ACCESS", Boolean::class.java, true)

    // JWT
    val jwtSecret: String get() = environment.getRequiredProperty("JWT_SECRET")
    val jwtAccessTokenExpirationMs: Long get() = environment.getProperty("JWT_ACCESS_EXPIRATION_MS", Long::class.java, 600000L)
    val jwtRefreshTokenExpirationMs: Long get() = environment.getProperty("JWT_REFRESH_EXPIRATION_MS", Long::class.java, 604800000L)

    // Cookies
    val cookieSecure: Boolean get() = environment.getProperty("COOKIE_SECURE", Boolean::class.java, false)

    // App
    val imageBaseUrl: String get() = s3PublicEndpoint
    val appUrl: String get() = environment.getProperty("APP_PUBLIC_URL", "http://localhost:8180")
}
