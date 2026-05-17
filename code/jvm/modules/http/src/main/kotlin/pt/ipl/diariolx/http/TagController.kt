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

    @PostMapping(Uris.Tags.CREATE)
    fun createTag(
        @RequestBody body: CreateUpdateTagRequestDTO,
    ): ResponseEntity<*> =
        when (val res = tagService.create(body.name, body.slug, body.description)) {
            is Success ->
                ResponseEntity
                    .created(Uris.Tags.byId(res.value))
                    .build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }

    @PutMapping(Uris.Tags.UPDATE)
    fun updateTag(
        @PathVariable id: String,
        @RequestBody body: CreateUpdateTagRequestDTO,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.update(id, body.name, body.slug, body.description)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @DeleteMapping(Uris.Tags.DELETE)
    fun deleteTag(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.delete(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @PostMapping(Uris.Tags.ARCHIVE)
    fun archiveTag(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.archive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @PostMapping(Uris.Tags.UNARCHIVE)
    fun unarchiveTag(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.unarchive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }
}
