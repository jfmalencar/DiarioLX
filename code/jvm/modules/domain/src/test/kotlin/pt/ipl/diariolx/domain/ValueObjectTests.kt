package pt.ipl.diariolx.domain

import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class ValueObjectTests {
    @Test
    fun `Slug parse accepts lowercase kebab-case and rejects the rest`() {
        // given: a valid kebab-case slug
        // when: parsing it
        val slug = Slug.parse("orcamento-estado-2026")

        // then: it is accepted and preserved
        assertEquals("orcamento-estado-2026", slug?.value)

        // when: parsing values that break the slug rules
        // then: each one is rejected
        assertNull(Slug.parse("Orcamento Estado"), "spaces and uppercase are invalid")
        assertNull(Slug.parse("-leading-dash"), "leading dash is invalid")
        assertNull(Slug.parse(null), "null is invalid")
    }

    @Test
    fun `Color parse accepts 3 and 6 digit hex and rejects the rest`() {
        // given/when: parsing valid hex colours
        // then: both short and long forms are accepted
        assertEquals("#fff", Color.parse("#fff")?.value)
        assertEquals("#A1B2C3", Color.parse("#A1B2C3")?.value)

        // when: parsing malformed colours
        // then: each one is rejected
        assertNull(Color.parse("fff"), "missing hash is invalid")
        assertNull(Color.parse("#12"), "wrong length is invalid")
        assertNull(Color.parse("#GGGGGG"), "non-hex characters are invalid")
    }
}
