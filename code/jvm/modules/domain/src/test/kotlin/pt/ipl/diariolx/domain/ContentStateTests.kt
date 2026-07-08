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
    private val now = Instant.fromEpochMilliseconds(1_700_000_000_000)
    private val past = Instant.fromEpochMilliseconds(1_600_000_000_000)
    private val future = Instant.fromEpochMilliseconds(1_800_000_000_000)

    private fun content(
        state: ContentState,
        publishedAt: Instant? = past,
    ) = Content(
        id = 1,
        type = ContentType.ARTICLE,
        title = "t",
        headline = "h",
        featuredImage = null,
        publishedAt = publishedAt,
        createdAt = now,
        updatedAt = now,
        state = state,
        tags = emptyList(),
        authors = emptyList(),
        blocks = emptyList(),
    )

    @Test
    fun `content is visible only when approved and its publish moment has passed`() {
        // approved + published in the past → visible (also covers backdating)
        assertTrue(content(ContentState.APPROVED, publishedAt = past).isVisibleAt(now))

        // approved but scheduled for the future → hidden until then
        assertFalse(content(ContentState.APPROVED, publishedAt = future).isVisibleAt(now))

        // approved but no publication moment set → not visible
        assertFalse(content(ContentState.APPROVED, publishedAt = null).isVisibleAt(now))

        // any non-approved state → never visible
        assertFalse(content(ContentState.DRAFT).isVisibleAt(now))
        assertFalse(content(ContentState.PENDING_REVIEW).isVisibleAt(now))
        assertFalse(content(ContentState.REJECTED).isVisibleAt(now))
    }

    @Test
    fun `editing a resolved content sends it back to draft, otherwise the state is kept`() {
        // resolved states → draft
        assertEquals(ContentState.DRAFT, content(ContentState.APPROVED).stateAfterEdit())
        assertEquals(ContentState.DRAFT, content(ContentState.REJECTED).stateAfterEdit())

        // in-progress states are untouched
        assertEquals(ContentState.DRAFT, content(ContentState.DRAFT).stateAfterEdit())
        assertEquals(ContentState.PENDING_REVIEW, content(ContentState.PENDING_REVIEW).stateAfterEdit())
    }
}
