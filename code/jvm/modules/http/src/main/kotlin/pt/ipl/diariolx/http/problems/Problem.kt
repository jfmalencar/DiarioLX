package pt.ipl.diariolx.http.problems

import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity

class Problem(
    val code: String,
    val status: HttpStatusCode,
) {
    val type: String = "$URL/$code.md"

    companion object {
        const val MEDIA_TYPE = "application/problem+json"
        const val URL = "https://github.com/jfmalencar/DiarioLX/tree/main/docs/problems"

        // Bridged from the Spring context at startup (see ProblemMessages). Title
        // and detail are resolved per request from messages_*.properties using the
        // locale negotiated from the Accept-Language header.
        lateinit var messageSource: MessageSource

        fun response(
            problem: Problem,
            instance: String,
        ): ResponseEntity<ProblemDetail> {
            val locale = LocaleContextHolder.getLocale()
            val title = messageSource.getMessage("problem.${problem.code}.title", null, problem.code, locale) ?: problem.code
            val detail = messageSource.getMessage("problem.${problem.code}.detail", null, "", locale).orEmpty()
            return ResponseEntity
                .status(problem.status.value())
                .header("Content-Type", MEDIA_TYPE)
                .body(
                    createProblemDetail(
                        problem.type,
                        title,
                        problem.status,
                        detail,
                        instance,
                    ),
                )
        }

        val notFound = Problem("resource-not-found", HttpStatus.NOT_FOUND)
        val invalidSlug = Problem("invalid-slug", HttpStatus.BAD_REQUEST)
        val invalidColor = Problem("invalid-color", HttpStatus.BAD_REQUEST)
        val invalidParent = Problem("invalid-parent", HttpStatus.BAD_REQUEST)
        val invalidAction = Problem("invalid-action", HttpStatus.BAD_REQUEST)
        val emptyName = Problem("empty-name", HttpStatus.BAD_REQUEST)
        val emptyField = Problem("empty-field", HttpStatus.BAD_REQUEST)
        val invalidField = Problem("invalid-field", HttpStatus.BAD_REQUEST)
        val invalidUsername = Problem("invalid-username", HttpStatus.BAD_REQUEST)
        val invalidEmail = Problem("invalid-email", HttpStatus.BAD_REQUEST)
        val invalidPassword = Problem("invalid-password", HttpStatus.BAD_REQUEST)
        val invalidName = Problem("invalid-name", HttpStatus.BAD_REQUEST)
        val invalidRole = Problem("invalid-role", HttpStatus.BAD_REQUEST)
        val invalidBio = Problem("invalid-bio", HttpStatus.BAD_REQUEST)
        val unauthorized = Problem("unauthorized", HttpStatus.UNAUTHORIZED)
        val userNotFound = Problem("user-not-found", HttpStatus.BAD_REQUEST)
        val noUserFound = Problem("no-user-found", HttpStatus.BAD_REQUEST)
        val usernameAlreadyExists = Problem("username-already-exists", HttpStatus.CONFLICT)
        val emailAlreadyExists = Problem("email-already-exists", HttpStatus.CONFLICT)
        val invalidInvite = Problem("invalid-invite", HttpStatus.BAD_REQUEST)
        val deactivatedAccount = Problem("deactivated-account", HttpStatus.FORBIDDEN)
        val invalidCredentials = Problem("invalid-credentials", HttpStatus.BAD_REQUEST)
        val authorNotFound = Problem("author-not-found", HttpStatus.BAD_REQUEST)
        val categoryNotFound = Problem("category-not-found", HttpStatus.BAD_REQUEST)
        val featuredMediaIdNotFound = Problem("featured-media-not-found", HttpStatus.BAD_REQUEST)
        val tagNotFound = Problem("tag-not-found", HttpStatus.BAD_REQUEST)
        val insufficientPhotos = Problem("insufficient-photos", HttpStatus.BAD_REQUEST)
        val categoryHasContents = Problem("category-has-contents", HttpStatus.CONFLICT)
        val tagHasContents = Problem("tag-has-contents", HttpStatus.CONFLICT)
        val publishedLocked = Problem("published-locked", HttpStatus.FORBIDDEN)
        val notContentOwner = Problem("not-content-owner", HttpStatus.FORBIDDEN)
    }
}
