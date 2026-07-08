package pt.ipl.diariolx.domain

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentModificationDenial
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class ContentModificationTests {
    private val epoch = Instant.fromEpochMilliseconds(1_700_000_000_000)

    private fun user(
        id: Int,
        role: UserRole,
    ) = User(
        id = id,
        username = Username("user$id"),
        email = Email("user$id@diariolx.pt"),
        passwordHash = PasswordHash("hash"),
        role = role,
        firstName = Name("Ana"),
        lastName = Name("Silva"),
        createdAt = epoch,
        updatedAt = epoch,
    )

    private fun content(
        state: ContentState,
        primaryAuthorId: Int,
    ) = Content(
        id = 1,
        type = ContentType.ARTICLE,
        title = "t",
        headline = "h",
        featuredImage = null,
        createdAt = epoch,
        updatedAt = epoch,
        state = state,
        tags = emptyList(),
        authors = listOf(Author(primaryAuthorId, "Ana", "primary", "ana")),
        blocks = emptyList(),
    )

    @Test
    fun `editors and admins may always modify content, even once published`() {
        val published = content(ContentState.APPROVED, primaryAuthorId = 99)
        assertNull(published.denyModificationFor(user(1, UserRole.EDITOR)))
        assertNull(published.denyModificationFor(user(1, UserRole.ADMIN)))
    }

    @Test
    fun `a contributor cannot modify published content`() {
        val published = content(ContentState.APPROVED, primaryAuthorId = 2)
        assertEquals(
            ContentModificationDenial.PUBLISHED_LOCKED,
            published.denyModificationFor(user(2, UserRole.CONTRIBUTOR)),
        )
    }

    @Test
    fun `a contributor cannot modify content they do not own`() {
        val draft = content(ContentState.DRAFT, primaryAuthorId = 99)
        assertEquals(
            ContentModificationDenial.NOT_OWNER,
            draft.denyModificationFor(user(3, UserRole.CONTRIBUTOR)),
        )
    }

    @Test
    fun `a contributor may modify their own unpublished content`() {
        val draft = content(ContentState.DRAFT, primaryAuthorId = 1)
        assertNull(draft.denyModificationFor(user(1, UserRole.CONTRIBUTOR)))
    }
}
