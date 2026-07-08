package pt.ipl.diariolx.domain

import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Password
import pt.ipl.diariolx.domain.users.value.Username
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

    @Test
    fun `Email parse enforces format and length`() {
        assertEquals("ana@diariolx.pt", Email.parse("ana@diariolx.pt")?.value)

        assertNull(Email.parse("sem-arroba"), "missing @ is invalid")
        assertNull(Email.parse("a@b"), "too short and no TLD is invalid")
        assertNull(Email.parse("@diariolx.pt"), "missing local part is invalid")
        assertNull(Email.parse(null), "null is invalid")
    }

    @Test
    fun `Username parse accepts allowed characters within length bounds`() {
        assertEquals("ana_silva.01", Username.parse("ana_silva.01")?.value)

        assertNull(Username.parse("ab"), "shorter than 3 is invalid")
        assertNull(Username.parse("com espaco"), "spaces are invalid")
        assertNull(Username.parse("inválido!"), "disallowed characters are invalid")
        assertNull(Username.parse("a".repeat(31)), "longer than 30 is invalid")
    }

    @Test
    fun `Password parse requires upper, lower, digit and special char`() {
        assertEquals("Test_123", Password.parse("Test_123")?.value)

        assertNull(Password.parse("test_123"), "missing uppercase is invalid")
        assertNull(Password.parse("TEST_123"), "missing lowercase is invalid")
        assertNull(Password.parse("Test_abc"), "missing digit is invalid")
        assertNull(Password.parse("Test1234"), "missing special char is invalid")
        assertNull(Password.parse("Ab1!"), "shorter than 8 is invalid")
    }
}
