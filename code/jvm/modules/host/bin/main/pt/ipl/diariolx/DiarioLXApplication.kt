package pt.ipl.diariolx

import kotlinx.datetime.Clock
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.MessageSource
import org.springframework.context.annotation.Bean
import org.springframework.context.support.ReloadableResourceBundleMessageSource
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@SpringBootApplication
class DiarioLXApplication {
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
}

private val logger = LoggerFactory.getLogger("main")

fun main(args: Array<String>) {
    logger.info("Starting app")
    runApplication<DiarioLXApplication>(*args)
}
