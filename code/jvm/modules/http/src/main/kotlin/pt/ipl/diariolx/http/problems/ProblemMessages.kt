package pt.ipl.diariolx.http.problems

import org.springframework.context.MessageSource
import org.springframework.stereotype.Component

/**
 * Bridges the Spring-managed MessageSource into [Problem]'s companion so the
 * statically-built problem responses can resolve localized title/detail.
 */
@Component
class ProblemMessages(
    messageSource: MessageSource,
) {
    init {
        Problem.messageSource = messageSource
    }
}
