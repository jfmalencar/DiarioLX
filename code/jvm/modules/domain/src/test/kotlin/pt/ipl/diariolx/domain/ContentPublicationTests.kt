package pt.ipl.diariolx.domain

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentField
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.tag.TagSummary
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ContentPublicationTests {
    private val epoch = Instant.fromEpochMilliseconds(1_700_000_000_000)

    private fun article(
        title: String = "Título",
        headline: String = "Entrada",
        slug: String? = "titulo",
        category: CategorySummary? = CategorySummary(1, "Política", Slug.parse("politica")!!, Color.parse("#abcdef")!!),
        featuredImage: MediaSummary? = MediaSummary(1, "img.jpg", null, "alt", "image/jpeg", 1000),
        tags: List<TagSummary> = listOf(TagSummary(1, "Benfica", "benfica")),
    ) = Content(
        id = 1,
        type = ContentType.ARTICLE,
        title = title,
        headline = headline,
        featuredImage = featuredImage,
        slug = slug,
        category = category,
        createdAt = epoch,
        updatedAt = epoch,
        state = ContentState.DRAFT,
        tags = tags,
        authors = emptyList(),
        blocks = emptyList(),
    )

    @Test
    fun `a fully populated article has no missing fields`() {
        // given: an article with every required field
        // then: nothing is missing — it may be submitted or published
        assertTrue(article().missingPublicationFields().isEmpty())
    }

    @Test
    fun `every absent required field is reported at once`() {
        // given: an article stripped of its required fields
        val missing =
            article(
                title = "",
                slug = null,
                category = null,
                featuredImage = null,
                tags = emptyList(),
            ).missingPublicationFields()

        // then: each missing field is flagged (not just the first), so the UI can highlight them all
        assertEquals(
            setOf(
                ContentField.TITLE,
                ContentField.SLUG,
                ContentField.CATEGORY,
                ContentField.TAG,
                ContentField.FEATURED_IMAGE,
            ),
            missing.toSet(),
        )
    }
}
