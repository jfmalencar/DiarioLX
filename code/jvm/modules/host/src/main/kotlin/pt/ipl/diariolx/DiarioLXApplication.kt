package pt.ipl.diariolx

import kotlinx.datetime.Clock
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
import pt.ipl.diariolx.domain.invites.config.InviteDomainConfig
import pt.ipl.diariolx.domain.users.config.UsersDomainConfig
import pt.ipl.diariolx.http.auth.AuthenticatedUserArgumentResolver
import pt.ipl.diariolx.http.auth.AuthenticationInterceptor
import pt.ipl.diariolx.http.invite.InviteArgumentResolver
import pt.ipl.diariolx.http.invite.InviteInterceptor
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.repository.mem.TransactionManagerMem
import pt.ipl.diariolx.repository.mem.CategoryRepositoryMem
import pt.ipl.diariolx.repository.mem.InviteRepositoryMem
import pt.ipl.diariolx.repository.mem.UserRepositoryMem
import pt.ipl.diariolx.utils.token.Sha256TokenEncoder
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

@Configuration
class PipelineConfigurer(
    private val authenticationInterceptor: AuthenticationInterceptor,
    private val inviteInterceptor: InviteInterceptor,
    private val authenticatedUserArgumentResolver: AuthenticatedUserArgumentResolver,
    private val inviteArgumentResolver: InviteArgumentResolver,
): WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(authenticationInterceptor)
        registry.addInterceptor(inviteInterceptor)
    }

    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(authenticatedUserArgumentResolver)
        resolvers.add(inviteArgumentResolver)
    }
}

@SpringBootApplication
class DiarioLXApplication {
    
    // ======================== Memory Mode Configuration ========================
    // This application is configured to use IN-MEMORY repositories for development
    // To use database mode, uncomment the JDBC beans below and comment out memory beans
    
    @Bean
    fun transactionManager(): TransactionManager =
        TransactionManagerMem(
            categoryRepository = CategoryRepositoryMem(),
            userRepository = UserRepositoryMem(),
            inviteRepository = InviteRepositoryMem(),
        )

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
    fun tokenEncoder() = Sha256TokenEncoder()

    @Bean
    fun usersDomainConfig() =
        UsersDomainConfig(
            tokenSizeInBytes = 256 / 8,
            tokenExpirationTime = 24.hours,
            sessionExpirationTime = 1.hours,
            maxTokensPerUser = 3,
        )

    @Bean
    fun inviteDomainConfig() = InviteDomainConfig(
        inviteExpirationTime = 30.minutes,
    )

    @Bean
    fun logger(): Logger  = LoggerFactory.getLogger(DiarioLXApplication::class.java)
}

private val logger = LoggerFactory.getLogger("main")

fun main(args: Array<String>) {
    logger.info("Starting app")
    runApplication<DiarioLXApplication>(*args)
}
