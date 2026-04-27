package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.article.Article
import pt.ipl.diariolx.domain.article.ArticleSummary
import pt.ipl.diariolx.domain.article.NewArticle

interface ArticleRepository {
    fun create(article: NewArticle): Int

    fun getById(id: Int): Article?

    fun getBySlug(slug: String): Article?

    fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        archived: Boolean,
    ): List<ArticleSummary>

    fun delete(id: Int): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
