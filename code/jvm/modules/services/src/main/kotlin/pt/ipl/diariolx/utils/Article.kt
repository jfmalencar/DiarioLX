package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.article.Article

data class ArticleQuery(
    val page: Int = 1,
    val limit: Int = 20,
    val archived: Boolean = false,
)

sealed class ArticleError(
    val message: String,
) {
    object EmptyName : ArticleError("Article name cannot be empty")

    object InvalidSlug : ArticleError("Article slug must be unique")

    object SlugAlreadyExists : ArticleError("Article slug already exists")

    object ArticleNotFound : ArticleError("Article not found")
}

typealias ArticleResult = Either<ArticleError, Article>

typealias ArticleUpdateResult = Either<ArticleError, Unit>

typealias ArticleCreateResult = Either<ArticleError, Int>

typealias ArticleValidationResult = Either<ArticleError, Unit>
