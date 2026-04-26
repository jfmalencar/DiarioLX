package pt.ipl.diariolx.http

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.article.NewArticle
import pt.ipl.diariolx.http.model.ArticleResponse
import pt.ipl.diariolx.services.ArticleService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
class ArticleController(
    private val articleService: ArticleService,
) {
    @GetMapping(Uris.Articles.GET_BY_SLUG)
    fun getBySlug(
        @PathVariable slug: String,
    ): ResponseEntity<*> =
        when (val response = articleService.getBySlug(slug)) {
            is Success -> ResponseEntity.ok(mapOf("article" to ArticleResponse.from(response.value)))
            is Failure -> ResponseEntity.notFound().build<Unit>()
        }

    @GetMapping(Uris.Articles.GET_ALL)
    fun getAllArticles(
        @RequestParam page: Int = 1,
        @RequestParam limit: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<*> {
        val limit = if (limit > 30) 30 else limit
        val articles = articleService.getAll(page, limit, query, archived)
        return ResponseEntity.ok(mapOf("articles" to articles))
    }

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
