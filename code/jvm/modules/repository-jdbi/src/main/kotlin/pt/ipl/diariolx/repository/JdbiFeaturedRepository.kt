package pt.ipl.diariolx.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.FeaturedSectionInput
import pt.ipl.diariolx.domain.featured.SectionType
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.tag.TagSummary

class JdbiFeaturedRepository(
    private val handle: Handle,
) : FeaturedRepository {
    override fun getHomepage(): List<FeaturedSection> =
        handle
            .createQuery("select * from v_featured_sections where category_archived is not true")
            .mapTo<FeaturedSectionRow>()
            .list()
            .groupBy { it.sectionId }
            .map { (_, rows) ->
                val first = rows.first()
                FeaturedSection(
                    id = first.sectionId,
                    type = SectionType.valueOf(first.sectionType),
                    category =
                        if (first.sectionCategoryId != null) {
                            CategorySummary(
                                first.sectionCategoryId,
                                first.sectionCategoryName!!,
                                Slug(first.sectionCategorySlug!!),
                                Color(first.sectionCategoryColor!!),
                            )
                        } else {
                            null
                        },
                    position = first.sectionPosition,
                    contents =
                        rows
                            .filter { it.id != null }
                            .sortedBy { it.contentPosition }
                            .map { it.toSummary() },
                )
            }.sortedBy { it.position }

    override fun findPublishedIds(ids: List<Int>): Set<Int> {
        if (ids.isEmpty()) return emptySet()
        return handle
            .createQuery(
                """
                select id from v_contents_summary
                where id in (<ids>)
                  and published_at is not null
                  and published_at <= extract(epoch from now())
                """.trimIndent(),
            ).bindList("ids", ids)
            .mapTo<Int>()
            .toSet()
    }

    override fun saveHomepage(sections: List<FeaturedSectionInput>) {
        handle.createUpdate("delete from featured_sections").execute()

        sections.forEachIndexed { sectionIdx, section ->
            val sectionId =
                handle
                    .createQuery(
                        """
                        insert into featured_sections (type, category_id, position)
                        values (:type, :category_id, :position)
                        returning id
                        """.trimIndent(),
                    ).bind("type", section.type.name)
                    .bind("category_id", section.categoryId)
                    .bind("position", sectionIdx)
                    .mapTo<Int>()
                    .one()

            if (section.contentIds.isEmpty()) return@forEachIndexed

            val batch =
                handle.prepareBatch(
                    """
                    insert into featured_contents (section_id, content_id, position)
                    values (:section_id, :content_id, :position)
                    """.trimIndent(),
                )
            section.contentIds.forEachIndexed { contentIdx, contentId ->
                batch
                    .bind("section_id", sectionId)
                    .bind("content_id", contentId)
                    .bind("position", contentIdx)
                    .add()
            }
            batch.execute()
        }
    }

    private data class FeaturedSectionRow(
        // Dados da secção
        val sectionId: Int,
        val sectionType: String,
        val sectionCategoryId: Int?,
        val sectionCategoryName: String?,
        val sectionCategorySlug: String?,
        val sectionCategoryColor: String?,
        val sectionPosition: Int,
        val contentPosition: Int?,
        // Colunas de v_contents_summary (null quando a secção não tem conteúdos)
        val id: Int?,
        val type: String?,
        val title: String?,
        val headline: String?,
        val tagId: Int?,
        val tagName: String?,
        val tagSlug: String?,
        val contentState: String?,
        val slug: String?,
        val createdAt: Long?,
        val archivedAt: Long?,
        val publishedAt: Long?,
        val categoryId: Int?,
        val categorySlug: String?,
        val categoryName: String?,
        val categoryColor: String?,
        val featuredImage: String?,
        val embedUrl: String?,
        val authors: String?,
    ) {
        private inline fun <reified T> parseJson(json: String): T {
            val objectMapper = ObjectMapper().registerKotlinModule()
            return objectMapper.readValue(json)
        }

        fun toSummary(): ContentSummary =
            ContentSummary(
                id = id!!,
                type = ContentType.valueOf(type!!),
                title = title!!,
                headline = headline.orEmpty(),
                state = ContentState.valueOf(contentState!!),
                slug = slug,
                category =
                    if (categoryId != null && categoryName != null && categorySlug != null && categoryColor != null) {
                        CategorySummary(categoryId, categoryName, Slug(categorySlug), Color(categoryColor))
                    } else {
                        null
                    },
                tag =
                    if (tagId != null && tagName != null && tagSlug != null) {
                        TagSummary(tagId, tagName, tagSlug)
                    } else {
                        null
                    },
                createdAt = Instant.fromEpochSeconds(createdAt!!),
                archivedAt = archivedAt?.let { Instant.fromEpochSeconds(it) },
                publishedAt = publishedAt?.let { Instant.fromEpochSeconds(it) },
                featuredImage = featuredImage,
                embedUrl = embedUrl,
                authors = parseJson(authors!!),
            )
    }
}
