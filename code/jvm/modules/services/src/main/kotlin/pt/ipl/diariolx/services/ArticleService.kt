package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.article.Article
import pt.ipl.diariolx.domain.article.NewArticle
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.ArticleError
import pt.ipl.diariolx.utils.ArticleResult
import pt.ipl.diariolx.utils.ArticleUpdateResult
import pt.ipl.diariolx.utils.SlugValidator
import pt.ipl.diariolx.utils.TagCreateResult
import pt.ipl.diariolx.utils.TagError
import pt.ipl.diariolx.utils.TagValidationResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.success

@Named
class ArticleService(
    private val transactionManager: TransactionManager,
) {
    fun create(newArticle: NewArticle): TagCreateResult =
        transactionManager.run { tx ->
            val tagId = tx.articleRepository.create(newArticle)
            success(tagId)
        }

    fun getBySlug(slug: String): ArticleResult =
        transactionManager.run {
            val article = it.articleRepository.getBySlug(slug)
            if (article == null) {
                return@run failure(ArticleError.ArticleNotFound)
            } else {
                return@run success(article)
            }
        }

    fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Article> =
        transactionManager.run {
            it.articleRepository.getAll(page, limit, archived)
        }

    fun delete(id: Int): ArticleUpdateResult =
        transactionManager.run {
            val result = it.articleRepository.delete(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ArticleError.ArticleNotFound)
            }
        }

    fun archive(id: Int): ArticleUpdateResult =
        transactionManager.run {
            val result = it.articleRepository.archive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ArticleError.ArticleNotFound)
            }
        }

    fun unarchive(id: Int): ArticleUpdateResult =
        transactionManager.run {
            val result = it.articleRepository.unarchive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ArticleError.ArticleNotFound)
            }
        }

    private fun validateInputs(
        name: String?,
        slug: String?,
    ): TagValidationResult {
        if (name.isNullOrBlank()) {
            return failure(TagError.EmptyName)
        }
        if (slug.isNullOrEmpty() || SlugValidator.isValid(slug).not()) {
            return failure(TagError.InvalidSlug)
        }
        return success(Unit)
    }

    private fun validateData(
        tx: Transaction,
        id: Int?,
        slug: String?,
    ): TagValidationResult {
        val existing = tx.tagRepository.getBySlug(slug!!)
        if (existing != null && existing.id != id) {
            return failure(TagError.SlugAlreadyExists)
        }
        return success(Unit)
    }
}
