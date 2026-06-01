package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.content.NewContent
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnContentOk
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.content.ContentResponseDTO
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO
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
    @GetMapping(Uris.Content.GET_BY_SLUG)
    @MayReturnContentOk
    @MayReturnUnauthorized
    @MayReturnNotFound
    fun getBySlug(
        @PathVariable slug: String,
    ): ResponseEntity<*> =
        when (val response = contentService.getBySlug(slug)) {
            is Success -> ResponseEntity.ok(ContentResponseDTO.from(response.value))
            is Failure ->
                Problem.response(
                    Problem.notFound,
                    Uris.Content.GET_BY_SLUG,
                )
        }

    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Content.GET_ALL)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    fun getAllContent(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<PaginatedResponseDTO<ContentSummaryResponseDTO>> {
        val response = contentService.getAll(page, size, query, archived)
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
    @PostMapping(Uris.Content.CREATE)
    @MayReturnCreated
    @MayReturnUnauthorized
    @MayReturnBadRequest
    fun createContent(
        @RequestBody body: NewContent,
    ): ResponseEntity<*> =
        when (val response = contentService.create(body)) {
            is Success ->
                ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    response.value.toProblem(),
                    Uris.Content.CREATE,
                )
        }
}
