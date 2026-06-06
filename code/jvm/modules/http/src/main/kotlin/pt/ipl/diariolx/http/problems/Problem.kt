package pt.ipl.diariolx.http.problems

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import java.net.URI

class Problem(
    typeUri: URI,
    val title: String,
    val detail: String,
    val status: HttpStatusCode,
) {
    val type: String = typeUri.toASCIIString()

    companion object {
        const val MEDIA_TYPE = "application/problem+json"
        const val URL = "https://github.com/jfmalencar/DiarioLX/tree/main/docs/problems"

        fun response(
            problem: Problem,
            instance: String,
        ): ResponseEntity<ProblemDetail> =
            ResponseEntity
                .status(problem.status.value())
                .header("Content-Type", MEDIA_TYPE)
                .body(
                    createProblemDetail(
                        problem.type,
                        problem.title,
                        problem.status,
                        problem.detail,
                        instance,
                    ),
                )

        val notFound =
            Problem(
                URI("$URL/resource-not-found"),
                "Resource not found",
                "The resource with the provided ID was not found",
                HttpStatus.NOT_FOUND,
            )

        val invalidSlug =
            Problem(
                URI("$URL/invalid-slug"),
                "Invalid slug",
                "The provided slug is either invalid or already in use",
                HttpStatus.BAD_REQUEST,
            )

        val emptyField =
            Problem(
                URI("$URL/empty-field"),
                "Empty field",
                "The provided field is empty",
                HttpStatus.BAD_REQUEST,
            )

        val invalidField =
            Problem(
                URI("$URL/invalid-field"),
                "Invalid field",
                "The provided field is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidUsername =
            Problem(
                URI("$URL/invalid-username"),
                "Invalid username",
                "The provided username format is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidEmail =
            Problem(
                URI("$URL/invalid-email"),
                "Invalid email",
                "The provided email format is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidPassword =
            Problem(
                URI("$URL/invalid-password"),
                "Invalid password",
                "The provided password format is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidName =
            Problem(
                URI("$URL/invalid-name"),
                "Invalid name",
                "The provided name format is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidRole =
            Problem(
                URI("$URL/invalid-role"),
                "Invalid role",
                "The provided role is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidProfilePictureURL =
            Problem(
                URI("$URL/invalid-profile-picture-url"),
                "Invalid profile picture URL",
                "The provided profile picture URL is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val invalidBio =
            Problem(
                URI("$URL/invalid-bio"),
                "Invalid bio",
                "The provided bio format is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val unauthorized =
            Problem(
                URI("$URL/unauthorized"),
                "Unauthorized",
                "You do not have permission to perform this action",
                HttpStatus.UNAUTHORIZED,
            )

        val userNotFound =
            Problem(
                URI("$URL/user-not-found"),
                "User not found",
                "No user found with the provided ID",
                HttpStatus.BAD_REQUEST,
            )

        val noUserFound =
            Problem(
                URI("$URL/no-user-found"),
                "No user found",
                "No users match the search criteria",
                HttpStatus.BAD_REQUEST,
            )

        val usernameAlreadyExists =
            Problem(
                URI("$URL/username-already-exists"),
                "Username already exists",
                "The provided username is already associated with another account",
                HttpStatus.CONFLICT,
            )

        val emailAlreadyExists =
            Problem(
                URI("$URL/email-already-exists"),
                "Email already exists",
                "The provided email is already associated with another account",
                HttpStatus.CONFLICT,
            )

        val invalidInvite =
            Problem(
                URI("$URL/invalid-invite"),
                "Invalid invite",
                "The provided invite token is invalid or expired",
                HttpStatus.BAD_REQUEST,
            )

        val deactivatedAccount =
            Problem(
                URI("$URL/deactivated-account"),
                "Deactivated account",
                "The account associated with this user has been deactivated",
                HttpStatus.FORBIDDEN,
            )

        val invalidCredentials =
            Problem(
                URI("$URL/invalid-credentials"),
                "Invalid credentials",
                "The provided credentials are invalid",
                HttpStatus.BAD_REQUEST,
            )

        val authorNotFound =
            Problem(
                URI("$URL/author-not-found"),
                "Author not found",
                "The provided author id is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val categoryNotFound =
            Problem(
                URI("$URL/category-not-found"),
                "Category not found",
                "The provided category is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val featuredMediaIdNotFound =
            Problem(
                URI("$URL/featured-media-not-found"),
                "Featured Media ID not found",
                "The provided featured Media ID is invalid",
                HttpStatus.BAD_REQUEST,
            )

        val tagNotFound =
            Problem(
                URI("$URL/tag-not-found"),
                "Tag not found",
                "The provided tag is invalid",
                HttpStatus.BAD_REQUEST,
            )
    }
}
