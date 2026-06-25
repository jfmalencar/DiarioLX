package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnContentOk
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.dto.content.CategorySummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.PublicContentResponseDTO
import pt.ipl.diariolx.http.dto.content.ResourceContentsResponseDTO
import pt.ipl.diariolx.http.dto.content.TagSummaryResponseDTO
import pt.ipl.diariolx.http.dto.guest.HomepageResponseDTO
import pt.ipl.diariolx.http.dto.guest.SectionDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.dto.user.TeamMemberResponseDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.services.CategoryService
import pt.ipl.diariolx.services.ContentQueryService
import pt.ipl.diariolx.services.FeaturedService
import pt.ipl.diariolx.services.TagService
import pt.ipl.diariolx.services.UserService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Public", description = "APIs for reading publicly available content.")
class GuestController(
    private val contentQueryService: ContentQueryService,
    private val featuredService: FeaturedService,
    private val userService: UserService,
    private val tagService: TagService,
    private val categoryService: CategoryService,
) {
    @GetMapping(Uris.Guest.TEAM)
    fun getTeam(): ResponseEntity<*> = ResponseEntity.ok(userService.getTeam().map { TeamMemberResponseDTO.from(it) })

    @GetMapping(Uris.Guest.AUTHOR)
    @MayReturnNotFound
    fun getAuthor(
        @PathVariable slug: String,
    ): ResponseEntity<*> =
        userService
            .getByUsername(slug)
            ?.let { ResponseEntity.ok(TeamMemberResponseDTO.from(it)) }
            ?: Problem.response(Problem.notFound, Uris.Guest.AUTHOR)

    @GetMapping(Uris.Guest.TAG)
    @MayReturnNotFound
    fun getTagPage(
        @PathVariable slug: String,
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam type: ContentType? = null,
    ): ResponseEntity<*> {
        val tag = tagService.getBySlug(slug) ?: return Problem.response(Problem.notFound, Uris.Guest.TAG)
        val response = contentQueryService.getPublished(page = page, size = size, tag = slug, type = type)
        return ResponseEntity.ok(
            ResourceContentsResponseDTO(
                resource = TagSummaryResponseDTO(tag.id, tag.name, tag.slug.value),
                items = response.items.map { ContentSummaryResponseDTO.from(it) },
                pagination = paginationOf(response),
            ),
        )
    }

    @GetMapping(Uris.Guest.CATEGORY)
    @MayReturnNotFound
    fun getCategoryPage(
        @PathVariable slug: String,
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam type: ContentType? = null,
    ): ResponseEntity<*> {
        val category = categoryService.getBySlug(slug) ?: return Problem.response(Problem.notFound, Uris.Guest.CATEGORY)
        val response = contentQueryService.getPublished(page = page, size = size, category = slug, type = type)
        return ResponseEntity.ok(
            ResourceContentsResponseDTO(
                resource = CategorySummaryResponseDTO(category.id, category.name, category.slug.value, category.color.value),
                items = response.items.map { ContentSummaryResponseDTO.from(it) },
                pagination = paginationOf(response),
            ),
        )
    }

    @GetMapping(Uris.Guest.HOMEPAGE)
    @MayReturnBadRequest
    fun getHomePage(): ResponseEntity<*> {
        val response =
            HomepageResponseDTO(
                sections = featuredService.getHomepage().map { SectionDTO.from(it) },
                latestArticles =
                    contentQueryService
                        .getPublished(size = 4, type = ContentType.ARTICLE)
                        .items
                        .map { ContentSummaryResponseDTO.from(it) },
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
        @RequestParam category: String? = null,
        @RequestParam tag: String? = null,
        @RequestParam type: ContentType? = null,
        @RequestParam parentId: Int? = null,
        @RequestParam author: String? = null,
        @RequestParam creditedTo: String? = null,
    ): ResponseEntity<PaginatedResponseDTO<ContentSummaryResponseDTO>> {
        val response =
            contentQueryService.getPublished(
                page = page,
                size = size,
                query = query,
                category = category,
                tag = tag,
                type = type,
                parentId = parentId,
                author = author,
                creditedTo = creditedTo,
            )
        return ResponseEntity.ok(
            PaginatedResponseDTO(
                response.items.map { ContentSummaryResponseDTO.from(it) },
                paginationOf(response),
            ),
        )
    }

    private fun paginationOf(response: PageResponse<ContentSummary>): Pagination =
        Pagination(
            response.page,
            response.pageSize,
            response.hasPrevious,
            response.hasNext,
        )
}
