package pt.ipl.diariolx

import kotlinx.datetime.Clock
import org.jdbi.v3.core.Jdbi
import org.postgresql.ds.PGSimpleDataSource
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.MessageSource
import org.springframework.context.annotation.Bean
import org.springframework.context.support.ReloadableResourceBundleMessageSource
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import pt.ipl.diariolx.repository.configureWithAppRequirements
import pt.ipl.diariolx.storage.FileStorage
import pt.ipl.diariolx.storage.FileStorageFactory

@SpringBootApplication
class DiarioLXApplication {
    @Bean
    fun jdbi() =
        Jdbi
            .create(
                PGSimpleDataSource().apply {
                    setURL(Environment.getDbUrl())
                },
            ).configureWithAppRequirements()

    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()

    @Bean
    fun clock() = Clock.System

    @Bean
    fun messageSource(): MessageSource {
        val messageSource = ReloadableResourceBundleMessageSource()
        messageSource.setBasename("classpath:messages")
        messageSource.setDefaultEncoding("UTF-8")
        return messageSource
    }

    @Bean
    fun fileStorage(
        @Value("\${storage.s3.endpoint}") url: String,
        @Value("\${storage.s3.region}") region: String,
        @Value("\${storage.s3.access-key}") accessKey: String,
        @Value("\${storage.s3.secret-key}") secretKey: String,
        @Value("\${storage.s3.bucket}") bucket: String,
        @Value("\${storage.s3.path-style-access}") pathStyleAccess: Boolean,
    ): FileStorage =
        FileStorageFactory()
            .create(url, region, accessKey, secretKey, bucket, pathStyleAccess)
}

private val logger = LoggerFactory.getLogger("main")

fun main(args: Array<String>) {
    logger.info("Starting app")
    runApplication<DiarioLXApplication>(*args)
}
