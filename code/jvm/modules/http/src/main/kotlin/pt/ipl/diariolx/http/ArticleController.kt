package pt.ipl.diariolx.http

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.article.NewArticle
import pt.ipl.diariolx.http.annotations.RequireLogin
import pt.ipl.diariolx.http.model.ArticleResponseDTO
import pt.ipl.diariolx.services.ArticleService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
class ArticleController(
    private val articleService: ArticleService,
) {
    @RequireLogin
    @GetMapping(Uris.Articles.GET_BY_SLUG)
    fun getBySlug(
        @PathVariable slug: String,
    ): ResponseEntity<*> =
        when (val response = articleService.getBySlug(slug)) {
            is Success -> ResponseEntity.ok(mapOf("article" to ArticleResponseDTO.from(response.value)))
            is Failure -> ResponseEntity.notFound().build<Unit>()
        }

    @RequireLogin
    @GetMapping(Uris.Articles.GET_ALL)
    fun getAllArticles(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<*> {
        val size = if (size > 30) 30 else size
        val response = articleService.getAll(page, size, query, archived)
        return ResponseEntity.ok().body(
            mapOf(
                "articles" to response.items,
                "pagination" to
                    mapOf(
                        "hasNext" to response.hasNext,
                        "hasPrevious" to response.hasPrevious,
                        "page" to response.page,
                        "size" to response.pageSize,
                    ),
            ),
        )
    }

    @RequireLogin
    @PostMapping(Uris.Articles.CREATE)
    fun createArticle(
        @RequestBody body: NewArticle,
    ): ResponseEntity<*> =
        when (articleService.create(body)) {
            is Success ->
                ResponseEntity
                    .status(201)
                    .build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
}
