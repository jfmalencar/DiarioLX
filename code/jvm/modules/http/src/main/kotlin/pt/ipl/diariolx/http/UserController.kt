package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.slf4j.Logger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.MayReturnUserOk
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.dto.user.UpdateUserRequestDTO
import pt.ipl.diariolx.http.dto.user.UserResponseDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.UserService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Users", description = "APIs for managing users")
class UserController(
    private val userService: UserService,
    private val logger: Logger,
) {
    @RequireRole(UserRole.CONTRIBUTOR)
    @PatchMapping(Uris.Users.UPDATE)
    @MayReturnNoContent
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun updateUser(
        @Parameter(hidden = true) me: AuthenticatedUser,
        @RequestBody body: UpdateUserRequestDTO,
    ): ResponseEntity<*> =
        when (
            val response =
                userService.update(
                    me.user,
                    body.username,
                    body.email,
                    body.password,
                    body.fName,
                    body.lName,
                    body.bio,
                    body.profilePictureURL,
                )
        ) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Users.UPDATE,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Users.HOME)
    @MayReturnUserOk
    @MayReturnUnauthorized
    fun getCurrentUser(
        @Parameter(hidden = true) me: AuthenticatedUser,
    ): ResponseEntity<*> = ResponseEntity.ok(UserResponseDTO.from(me.user))

    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Users.GET_BY_ID)
    @MayReturnUserOk
    @MayReturnUnauthorized
    @MayReturnNotFound
    fun getUserById(
        @Parameter(hidden = true) me: AuthenticatedUser,
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = userService.get(me.user, id)) {
            is Success -> ResponseEntity.ok(UserResponseDTO.from(response.value))
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Users.GET_BY_ID,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Users.GET_ALL)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    fun getAllUsers(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 30,
        @RequestParam query: String? = null,
        @RequestParam deactivated: Boolean = false,
    ): ResponseEntity<*> {
        val response = userService.getAll(page, size, query, deactivated)
        return ResponseEntity.ok().body(
            PaginatedResponseDTO(
                response.items.map {
                    UserResponseDTO.from(it)
                },
                Pagination(response.page, response.pageSize, response.hasPrevious, response.hasNext),
            ),
        )
    }

    @RequireRole(UserRole.ADMIN)
    @DeleteMapping(Uris.Users.DELETE)
    fun removeUser(
        @Parameter(hidden = true) author: AuthenticatedUser,
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = userService.delete(author.user, id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Users.DELETE,
                )
        }

    @RequireRole(UserRole.ADMIN)
    @PostMapping(Uris.Users.DEACTIVATE)
    fun deactivateUser(
        @Parameter(hidden = true) author: AuthenticatedUser,
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = userService.deactivate(author.user, id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Users.DEACTIVATE,
                )
        }
}
