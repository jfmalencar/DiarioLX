package pt.ipl.diariolx.http

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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
