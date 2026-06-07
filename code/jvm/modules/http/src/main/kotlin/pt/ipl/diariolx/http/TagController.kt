package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnConflict
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnTagOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.dto.tag.CreateUpdateTagRequestDTO
import pt.ipl.diariolx.http.dto.tag.TagResponseDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.TagService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Tags", description = "APIs for managing tags")
class TagController(
    private val tagService: TagService,
) {
    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Tags.GET_BY_ID)
    @MayReturnTagOk
    @MayReturnUnauthorized
    @MayReturnNotFound
    fun getTagById(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val result = tagService.get(id)) {
            is Success -> ResponseEntity.ok(TagResponseDTO.from(result.value))
            is Failure ->
                Problem.response(
                    result.value.toProblem(),
                    Uris.Tags.GET_BY_ID,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Tags.GET_ALL)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    fun getAllTags(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<*> {
        val response = tagService.getAll(page, size, query, archived)
        return ResponseEntity.ok().body(
            PaginatedResponseDTO(
                response.items.map { TagResponseDTO.from(it) },
                Pagination(
                    response.page,
                    response.pageSize,
                    response.hasPrevious,
                    response.hasNext,
                ),
            ),
        )
    }

    @RequireRole(UserRole.ADMIN)
    @PostMapping(Uris.Tags.CREATE)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnBadRequest
    @MayReturnConflict
    @MayReturnCreated
    fun createTag(
        @RequestBody body: CreateUpdateTagRequestDTO,
    ): ResponseEntity<*> =
        when (val res = tagService.create(body.name, body.slug, body.description)) {
            is Success ->
                ResponseEntity
                    .created(Uris.Tags.byId(res.value))
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Tags.CREATE,
                )
        }

    @RequireRole(UserRole.ADMIN)
    @PutMapping(Uris.Tags.UPDATE)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnConflict
    @MayReturnNoContent
    fun updateTag(
        @PathVariable id: Int,
        @RequestBody body: CreateUpdateTagRequestDTO,
    ): ResponseEntity<*> =
        when (val res = tagService.update(id, body.name, body.slug, body.description)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Tags.UPDATE,
                )
        }

    @RequireRole(UserRole.ADMIN)
    @DeleteMapping(Uris.Tags.DELETE)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    fun deleteTag(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val res = tagService.delete(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Tags.DELETE,
                )
        }

    @RequireRole(UserRole.ADMIN)
    @PostMapping(Uris.Tags.ARCHIVE)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    fun archiveTag(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val res = tagService.archive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Tags.ARCHIVE,
                )
        }

    @RequireRole(UserRole.ADMIN)
    @PostMapping(Uris.Tags.UNARCHIVE)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    fun unarchiveTag(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val res = tagService.unarchive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Tags.UNARCHIVE,
                )
        }
}
