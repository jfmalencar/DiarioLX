package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.article.Article
import pt.ipl.diariolx.domain.article.NewArticle

interface ArticleRepository {
    fun create(article: NewArticle): Int

    fun getById(id: Int): Article?

    fun getBySlug(slug: String): Article?

    fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Article>

    fun delete(id: Int): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
