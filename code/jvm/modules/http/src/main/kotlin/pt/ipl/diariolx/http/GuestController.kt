package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO
import pt.ipl.diariolx.http.dto.guest.HomepageResponseDTO
import pt.ipl.diariolx.services.ContentQueryService

@RestController
@Tag(name = "Public", description = "APIs for reading publicly available content.")
class GuestController(
    private val contentQueryService: ContentQueryService,
) {
    @GetMapping(Uris.Public.HOMEPAGE)
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
