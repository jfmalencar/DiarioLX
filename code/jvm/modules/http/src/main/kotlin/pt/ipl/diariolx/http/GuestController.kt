package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnContentOk
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.PublicContentResponseDTO
import pt.ipl.diariolx.http.dto.guest.HomepageResponseDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.services.ContentQueryService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Public", description = "APIs for reading publicly available content.")
class GuestController(
    private val contentQueryService: ContentQueryService,
) {
    @GetMapping(Uris.Guest.HOMEPAGE)
    @MayReturnBadRequest
    fun getHomePage(): ResponseEntity<*> {
        val response =
            HomepageResponseDTO(
                latestArticles = fetchByType(ContentType.ARTICLE, 4),
                lisboaCidadeAberta = fetchByCategory("lisboa-cidade-aberta"),
                aFundo = fetchByCategory("a-fundo"),
                especiais = fetchByCategory("especiais"),
                latestPhotos = fetchByType(ContentType.PHOTOS, 3),
                latestVideos = fetchByType(ContentType.VIDEO, 4),
                latestPodcasts = fetchByType(ContentType.PODCAST, 4),
            )
        return ResponseEntity.ok(response)
    }

    @GetMapping(Uris.Guest.GET_CONTENT)
    @MayReturnContentOk
    @MayReturnNotFound
    fun getContent(
        @PathVariable slug: String,
    ): ResponseEntity<*> =
        when (val response = contentQueryService.getPublishedBySlug(slug)) {
            is Success -> ResponseEntity.ok(PublicContentResponseDTO.from(response.value))
            is Failure ->
                Problem.response(
                    Problem.notFound,
                    Uris.Guest.GET_CONTENT,
                )
        }

    @GetMapping(Uris.Guest.LIST_CONTENT)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    fun getAllContent(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
    ): ResponseEntity<PaginatedResponseDTO<ContentSummaryResponseDTO>> {
        val response = contentQueryService.getPublished(page, size, query)
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

    private fun fetchByCategory(category: String) =
        contentQueryService
            .getPublished(size = 4, type = ContentType.ARTICLE, category = category)
            .items
            .map { ContentSummaryResponseDTO.from(it) }

    private fun fetchByType(
        type: ContentType,
        size: Int,
    ) = contentQueryService
        .getPublished(size = size, type = type)
        .items
        .map { ContentSummaryResponseDTO.from(it) }
}
