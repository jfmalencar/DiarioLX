package pt.ipl.diariolx

import kotlinx.datetime.Clock
import org.jdbi.v3.core.Jdbi
import org.postgresql.ds.PGSimpleDataSource
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.MessageSource
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.support.ReloadableResourceBundleMessageSource
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import pt.ipl.diariolx.domain.auth.JwtConfig
import pt.ipl.diariolx.domain.invites.config.InviteDomainConfig
import pt.ipl.diariolx.domain.media.Buckets
import pt.ipl.diariolx.domain.media.MediaBaseUrl
import pt.ipl.diariolx.domain.users.config.UsersDomainConfig
import pt.ipl.diariolx.http.auth.AuthenticatedUserArgumentResolver
import pt.ipl.diariolx.http.auth.AuthenticationInterceptor
import pt.ipl.diariolx.http.auth.RefreshTokenArgumentResolver
import pt.ipl.diariolx.http.invite.InviteArgumentResolver
import pt.ipl.diariolx.http.invite.InviteInterceptor
import pt.ipl.diariolx.repository.JdbiTransactionManager
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.repository.configureWithAppRequirements
import pt.ipl.diariolx.storage.FileStorage
import pt.ipl.diariolx.storage.FileStorageFactory
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

@Configuration
class PipelineConfigurer(
    private val authenticationInterceptor: AuthenticationInterceptor,
    private val inviteInterceptor: InviteInterceptor,
    private val authenticatedUserArgumentResolver: AuthenticatedUserArgumentResolver,
    private val refreshTokenArgumentResolver: RefreshTokenArgumentResolver,
    private val inviteArgumentResolver: InviteArgumentResolver,
) : WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(authenticationInterceptor)
        registry.addInterceptor(inviteInterceptor)
    }

    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(authenticatedUserArgumentResolver)
        resolvers.add(refreshTokenArgumentResolver)
        resolvers.add(inviteArgumentResolver)
    }
}

@SpringBootApplication
class DiarioLXApplication {
    // ======================== Database Mode Configuration ========================
    // This application is configured to use JDBI/PostgreSQL database
    // To use in-memory mode, comment out the jdbiTransactionManager and uncomment memoryTransactionManager

    @Bean
    fun jdbi(appEnv: AppEnvironment): Jdbi {
        logger.info("Connecting to database...")
        logger.info("Database URL: ${appEnv.dbUrl}")
        return Jdbi
            .create(
                PGSimpleDataSource().apply {
                    setURL(appEnv.dbUrl)
                },
            ).configureWithAppRequirements()
    }

    @Bean
    fun transactionManager(jdbi: Jdbi): TransactionManager {
        logger.info("Using JDBI Transaction Manager")
        return JdbiTransactionManager(
            jdbi = jdbi,
            logger(),
        )
    }

    // === UNCOMMENT BELOW TO USE IN-MEMORY REPOSITORIES INSTEAD ===

    /*
    @Bean
    fun transactionManager(): TransactionManager =
        TransactionManagerMem(
            categoryRepository = CategoryRepositoryMem(),
            userRepository = UserRepositoryMem(),
            inviteRepository = InviteRepositoryMem(),
        )
     */

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
    fun usersDomainConfig() =
        UsersDomainConfig(
            tokenSizeInBytes = 256 / 8,
            tokenExpirationTime = 24.hours,
            sessionExpirationTime = 1.hours,
            maxTokensPerUser = 3,
        )

    @Bean
    fun inviteDomainConfig() =
        InviteDomainConfig(
            inviteExpirationTime = 60.minutes,
        )

    @Bean fun mediaBaseUrl(appEnv: AppEnvironment) = MediaBaseUrl(appEnv.imageBaseUrl)

    @Bean
    fun logger(): Logger = LoggerFactory.getLogger(DiarioLXApplication::class.java)

    @Bean
    fun buckets(appEnv: AppEnvironment) =
        Buckets(
            appEnv.s3PublicBucket,
        )

    @Bean
    fun fileStorage(appEnv: AppEnvironment): FileStorage =
        FileStorageFactory().create(
            appEnv.s3Endpoint,
            appEnv.s3PublicEndpoint,
            appEnv.s3Region,
            appEnv.s3AccessKey,
            appEnv.s3SecretKey,
            appEnv.s3PathStyleAccess,
        )

    @Bean
    fun jwtConfig(appEnv: AppEnvironment): JwtConfig =
        JwtConfig(
            appEnv.jwtSecret,
            appEnv.jwtAccessTokenExpirationMs,
            appEnv.jwtRefreshTokenExpirationMs,
        )
}

private val logger = LoggerFactory.getLogger("main")

fun main(args: Array<String>) {
    logger.info("Starting app")
    runApplication<DiarioLXApplication>(*args)
}
