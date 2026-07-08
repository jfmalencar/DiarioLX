package pt.ipl.diariolx.domain

import pt.ipl.diariolx.domain.featured.FeaturedSectionInput
import pt.ipl.diariolx.domain.featured.SectionPolicy
import pt.ipl.diariolx.domain.featured.SectionRule
import pt.ipl.diariolx.domain.featured.SectionType
import pt.ipl.diariolx.domain.featured.SectionViolation
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class SectionPolicyTests {
    private val policy =
        SectionPolicy(
            rules =
                mapOf(
                    SectionType.CATEGORY to SectionRule(maxArticles = 4, canBeAdded = true, hasCategory = true),
                    SectionType.HIGHLIGHT to SectionRule(maxArticles = 4, canBeAdded = false, hasCategory = false),
                ),
        )

    private fun section(
        type: SectionType,
        categoryId: Int? = null,
        contentIds: List<Int> = emptyList(),
    ) = FeaturedSectionInput(type, categoryId, contentIds)

    @Test
    fun `a well-formed layout has no violation`() {
        val layout =
            listOf(
                section(SectionType.HIGHLIGHT, contentIds = listOf(1, 2)),
                section(SectionType.CATEGORY, categoryId = 7, contentIds = listOf(3, 4)),
            )
        assertNull(policy.validate(layout))
    }

    @Test
    fun `a category section without a category is rejected`() {
        assertEquals(
            SectionViolation.CategoryRequired,
            policy.validate(listOf(section(SectionType.CATEGORY, categoryId = null))),
        )
    }

    @Test
    fun `a non-category section carrying a category is rejected`() {
        assertEquals(
            SectionViolation.CategoryNotAllowed,
            policy.validate(listOf(section(SectionType.HIGHLIGHT, categoryId = 7))),
        )
    }

    @Test
    fun `exceeding the article limit is rejected`() {
        assertEquals(
            SectionViolation.TooManyArticles(SectionType.CATEGORY, max = 4, got = 5),
            policy.validate(listOf(section(SectionType.CATEGORY, categoryId = 7, contentIds = listOf(1, 2, 3, 4, 5)))),
        )
    }

    @Test
    fun `repeating a singleton section is rejected`() {
        assertEquals(
            SectionViolation.DuplicateSingleton(SectionType.HIGHLIGHT),
            policy.validate(listOf(section(SectionType.HIGHLIGHT), section(SectionType.HIGHLIGHT))),
        )
    }
}
