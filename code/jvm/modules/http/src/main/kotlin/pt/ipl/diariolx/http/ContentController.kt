package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnContentOk
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.content.ContentResponseDTO
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.CreateContentDTO
import pt.ipl.diariolx.http.dto.content.CreateContentResponseDTO
import pt.ipl.diariolx.http.dto.content.UpdateContentDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.ContentService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Contents", description = "APIs for managing contents")
class ContentController(
    private val contentService: ContentService,
) {
    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Content.CONTENT_BY_ID)
    @MayReturnContentOk
    @MayReturnUnauthorized
    @MayReturnNotFound
    fun internalGetById(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = contentService.internalGetById(id)) {
            is Success -> ResponseEntity.ok(ContentResponseDTO.from(response.value))
            is Failure ->
                Problem.response(
                    Problem.notFound,
                    Uris.Content.CONTENT_BY_ID,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Content.INTERNAL_GET_ALL)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    fun internalGetAllContent(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam state: ContentState? = null,
        @Parameter(hidden = true) me: AuthenticatedUser,
    ): ResponseEntity<PaginatedResponseDTO<ContentSummaryResponseDTO>> {
        val response = contentService.getAll(page, size, query, state, me.user)
        return ResponseEntity.ok().body(
            PaginatedResponseDTO(
                response.items.map { ContentSummaryResponseDTO.from(it) },
                Pagination(
                    response.page,
                    response.pageSize,
                    response.hasPrevious,
                    response.hasNext,
                ),
            ),
        )
    }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PostMapping(Uris.Content.MAIN)
    @MayReturnCreated
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun createEmptyContent(
        @RequestBody body: CreateContentDTO,
    ): ResponseEntity<*> =
        when (val response = contentService.createEmpty(body.type)) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(CreateContentResponseDTO(response.value))
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.MAIN,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PutMapping(Uris.Content.MAIN)
    @MayReturnContentOk
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun updateContent(
        @RequestBody body: UpdateContentDTO,
    ): ResponseEntity<*> =
        when (
            val response =
                contentService.update(
                    body.id,
                    body.title,
                    body.headline,
                    body.featuredMediaId,
                    body.slug,
                    body.categoryId,
                    body.authors,
                    body.tags,
                    body.blocks,
                )
        ) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.OK)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.MAIN,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @DeleteMapping(Uris.Content.CONTENT_BY_ID)
    @MayReturnContentOk
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun deleteContent(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = contentService.delete(id)) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.OK)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.CONTENT_BY_ID,
                )
        }

    @RequireRole(UserRole.EDITOR)
    @PostMapping(Uris.Content.ARCHIVE)
    @MayReturnContentOk
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun archiveContent(
        @PathVariable id: Int,
        @RequestParam archive: Boolean,
    ): ResponseEntity<*> =
        when (val response = if (archive) contentService.archive(id) else contentService.unarchive(id)) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.OK)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.ARCHIVE,
                )
        }

    @RequireRole(UserRole.EDITOR)
    @PostMapping(Uris.Content.PUBLISH)
    @MayReturnNoContent
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun publishContent(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = contentService.publish(id)) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.PUBLISH,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PostMapping(Uris.Content.SUBMIT)
    @MayReturnNoContent
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun submitContent(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val response = contentService.submit(id)) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.SUBMIT,
                )
        }

    @RequireRole(UserRole.EDITOR)
    @PostMapping(Uris.Content.REJECT)
    @MayReturnContentOk
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun rejectContent(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (
            val response =
                contentService.reject(
                    id,
                )
        ) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.OK)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.PUBLISH,
                )
        }
}
