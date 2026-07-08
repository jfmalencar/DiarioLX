package pt.ipl.diariolx.domain

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentType
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ContentStateTests {
    private val epoch = Instant.fromEpochMilliseconds(1_700_000_000_000)

    private fun content(state: ContentState) =
        Content(
            id = 1,
            type = ContentType.ARTICLE,
            title = "t",
            headline = "h",
            featuredImage = null,
            createdAt = epoch,
            updatedAt = epoch,
            state = state,
            tags = emptyList(),
            authors = emptyList(),
            blocks = emptyList(),
        )

    @Test
    fun `only published content is publicly visible`() {
        assertTrue(content(ContentState.PUBLISHED).isPubliclyVisible)
        assertFalse(content(ContentState.DRAFT).isPubliclyVisible)
        assertFalse(content(ContentState.PENDING_REVIEW).isPubliclyVisible)
        assertFalse(content(ContentState.REJECTED).isPubliclyVisible)
    }

    @Test
    fun `editing a resolved content sends it back to draft, otherwise the state is kept`() {
        // resolved states → draft
        assertEquals(ContentState.DRAFT, content(ContentState.PUBLISHED).stateAfterEdit())
        assertEquals(ContentState.DRAFT, content(ContentState.REJECTED).stateAfterEdit())
        // in-progress states are untouched
        assertEquals(ContentState.DRAFT, content(ContentState.DRAFT).stateAfterEdit())
        assertEquals(ContentState.PENDING_REVIEW, content(ContentState.PENDING_REVIEW).stateAfterEdit())
    }
}
