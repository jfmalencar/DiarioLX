package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.article.Article
import pt.ipl.diariolx.domain.article.NewArticle
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.tag.TagSummary
import pt.ipl.diariolx.repository.ArticleRepository

class ArticleRepositoryMem : ArticleRepository {
    private val categoryRepo = CategoryRepositoryMem()
    private val tagRepo = TagRepositoryMem()

    private val articles = mutableListOf<Article>()
    private var currentId = 0

    override fun create(article: NewArticle): Int {
        val id = ++currentId

        val category = categoryRepo.getById(article.categoryId) ?: error("Category not found")
        val tags =
            article.tags.map {
                val tag = tagRepo.getById(it.tagId) ?: error("Tag not found")
                TagSummary(tag.id, tag.name, tag.name)
            }

        val newArticle =
            Article(
                id = id,
                title = article.title,
                slug = article.slug,
                headline = article.headline,
                featuredImage = null,
                category = CategorySummary(id = category.id, name = category.name, category.slug),
                tags = tags,
                blocks = listOf(),
                authors = article.authors.map { Author(it.authorId, "author") },
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
                publishedAt = Clock.System.now(),
            )

        articles.add(newArticle)
        return id
    }

    override fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Article> = articles.filter { !archived || it.archivedAt != null }

    override fun delete(id: Int): Boolean {
        if (articles.none { it.id == id }) return false
        articles.removeIf { it.id == id }
        return true
    }

    override fun getById(id: Int): Article? = articles.find { it.id == id }

    override fun getBySlug(slug: String): Article? = articles.find { it.slug == slug }

    override fun archive(id: Int): Boolean {
        val articleToArchive = articles.find { it.id == id }
        if (articleToArchive != null) {
            val now = Clock.System.now()
            val articleArchived = articleToArchive.copy(archivedAt = now, updatedAt = now)
            articles.remove(articleToArchive)
            articles.add(articleArchived)
            return true
        }
        return false
    }

    override fun unarchive(id: Int): Boolean {
        val articleToUnarchive = articles.find { it.id == id }
        if (articleToUnarchive != null) {
            val now = Clock.System.now()
            val articleArchived = articleToUnarchive.copy(archivedAt = null, updatedAt = now)
            articles.remove(articleToUnarchive)
            articles.add(articleArchived)
            return true
        }
        return false
    }
}
