package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import kotlinx.datetime.Clock
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.media.AppBaseUrl
import pt.ipl.diariolx.services.ContentQueryService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Open Graph", description = "APIs for generating Open Graph tags")
class OpenGraphController(
    private val contentService: ContentQueryService,
    private val appBaseUrl: AppBaseUrl,
) {
    @GetMapping(Uris.OpenGraph.PUBLISHED_CONTENT, produces = [MediaType.TEXT_HTML_VALUE])
    fun publishedContent(
        @PathVariable slug: String,
    ): ResponseEntity<String> {
        return when (val result = contentService.getPublishedBySlug(slug)) {
            is Failure -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()
            is Success -> {
                val content = result.value
                if (!content.isVisibleAt(Clock.System.now())) return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

                val canonicalUrl = "${appBaseUrl.apiBaseUrl}/p/${content.slug}"
                val imageUrl =
                    content.featuredImage?.let { "${appBaseUrl.apiBaseUrl}/${it.path}" }
                        ?: "${appBaseUrl.apiBaseUrl}/media/default-og-image.png"

                val title = escapeHtml(content.title)
                val description = escapeHtml(content.headline)

                val html =
                    """
                    <!DOCTYPE html>
                    <html lang="pt">
                    <head>
                    <meta charset="utf-8">
                    <title>$title — Diário LX</title>
                    <meta name="description" content="$description">
                    <meta property="og:type" content="article">
                    <meta property="og:site_name" content="DiárioLX">
                    <meta property="og:title" content="$title">
                    <meta property="og:description" content="$description">
                    <meta property="og:image" content="${escapeHtml(imageUrl)}">
                    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
                    <meta name="twitter:card" content="summary_large_image">
                    <meta http-equiv="refresh" content="0; url=${escapeHtml(canonicalUrl)}">
                    </head>
                    <body>
                    <p><a href="${escapeHtml(canonicalUrl)}">Ler o conteúdo no DiárioLX</a></p>
                    </body>
                    </html>
                    """.trimIndent()

                ResponseEntity
                    .ok()
                    .header("Cache-Control", "public, max-age=300")
                    .body(html)
            }
        }
    }

    private fun escapeHtml(value: String): String =
        buildString(value.length) {
            for (ch in value) {
                when (ch) {
                    '&' -> append("&amp;")
                    '<' -> append("&lt;")
                    '>' -> append("&gt;")
                    '"' -> append("&quot;")
                    '\'' -> append("&#39;")
                    else -> append(ch)
                }
            }
        }
}
