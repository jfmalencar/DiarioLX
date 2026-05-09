package pt.ipl.diariolx.http

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.invites.InviteRole
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.services.InviteService
import pt.ipl.diariolx.utils.Either
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success
import pt.ipl.diariolx.utils.UserError

@RestController
class InviteController(
    private val inviteServices: InviteService,
) {
    @RequireRole("ADMIN")
    @PostMapping(Uris.Invites.CREATE)
    fun createInvite(
        author: AuthenticatedUser,
        @RequestBody body: InviteRole,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            Uris.Invites.CREATE,
            inviteServices.createInvite(author.user, body.role),
            HttpStatus.CREATED,
        ) {
            mapOf(
                "inviteToken" to it.invite,
                "expiresAt" to it.expiresAt.toString(),
            )
        }

    @RequireRole("ADMIN")
    @GetMapping(Uris.Invites.GET_ALL)
    fun getAllInvites(
        @RequestParam page: Int = 1,
        @RequestParam limit: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam expired: Boolean? = null,
    ): ResponseEntity<*> {
        val response = inviteServices.getAllInvites(page, limit, query, expired)
        return ResponseEntity.ok().body(
            mapOf(
                "invites" to
                    response.items.map {
                        mapOf(
                            "id" to it.id,
                            "invite" to it.invite,
                            "createdAt" to it.createdAt.toString(),
                            "expiresAt" to it.expiresAt.toString(),
                            "role" to it.role.name,
                        )
                    },
                "pagination" to
                    mapOf(
                        "hasPrevious" to response.hasPrevious,
                        "hasNext" to response.hasNext,
                        "page" to response.page,
                        "size" to response.pageSize,
                    ),
            ),
        )
    }

    private inline fun <T> handleUserOperationResult(
        path: String,
        result: Either<UserError, T>,
        status: HttpStatus = HttpStatus.OK,
        successBodyBuilder: (T) -> Any,
    ): ResponseEntity<*> =
        when (result) {
            is Failure -> handleUserError(result.value, path)
            is Success -> ResponseEntity.status(status).body(successBodyBuilder(result.value))
        }

    private fun handleUserError(
        error: UserError,
        instance: String,
    ): ResponseEntity<ProblemDetail> =
        when (error) {
            is UserError.InvalidRole ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-role",
                            title = "Invalid role",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided role is invalid",
                            instance = instance,
                        ),
                    )
            else ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/bad-request",
                            title = "Bad request",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "Something went wrong. Please try again later.",
                            instance = instance,
                        ),
                    )
        }
}
