package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.invites.InviteRole
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnInviteOk
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.invite.InviteResponseDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.InviteService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Invites", description = "APIs for managing invites")
class InviteController(
    private val inviteServices: InviteService,
) {
    @RequireRole(UserRole.ADMIN)
    @PostMapping(Uris.Invites.CREATE)
    @MayReturnInviteOk
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnBadRequest
    fun createInvite(
        @Parameter(hidden = true) author: AuthenticatedUser,
        @RequestBody body: InviteRole,
    ): ResponseEntity<*> =
        when (val result = inviteServices.createInvite(author.user, body.role)) {
            is Success -> ResponseEntity.ok().body(InviteResponseDTO.from(result.value))
            is Failure -> Problem.response(result.value.toProblem(), Uris.Invites.CREATE)
        }

    @RequireRole(UserRole.ADMIN)
    @GetMapping(Uris.Invites.GET_ALL)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    @MayReturnForbidden
    fun getAllInvites(
        @RequestParam page: Int = 1,
        @RequestParam limit: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam expired: Boolean? = null,
    ): ResponseEntity<*> {
        val response = inviteServices.getAllInvites(page, limit, query, expired)
        return ResponseEntity.ok().body(
            PaginatedResponseDTO(
                response.items.map { InviteResponseDTO.from(it) },
                Pagination.of(response),
            ),
        )
    }

    @RequireRole(UserRole.ADMIN)
    @DeleteMapping(Uris.Invites.DELETE)
    @MayReturnNoContent
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnNotFound
    fun deleteInvite(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val result = inviteServices.deleteInvite(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> Problem.response(result.value.toProblem(), Uris.Invites.DELETE)
        }
}
