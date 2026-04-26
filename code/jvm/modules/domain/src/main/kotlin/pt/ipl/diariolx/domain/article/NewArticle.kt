package pt.ipl.diariolx.domain.article

data class NewArticle(
    val title: String,
    val headline: String,
    val slug: String,
    val categoryId: Int,
    val featuredMediaId: Int,
    val publishedAt: String?,
    val authors: List<ArticleAuthor>,
    val tags: List<ArticleTag>,
    val blocks: List<NewArticleBlock>,
)
