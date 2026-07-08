package pt.ipl.diariolx.services

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.testWithTransactionManagerAndRollback
import kotlin.test.Test
import kotlin.test.assertTrue

class ContentQueryServiceTest {
    @Test
    fun `getPublished returns only published content`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = ContentQueryService(tm, Clock.System)

            val page = service.getPublished(size = 50)

            assertTrue(page.items.isNotEmpty(), "seed data should contain published content")
            assertTrue(page.items.all { it.state == ContentState.APPROVED })
        }

    @Test
    fun `getPublished filters by type`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = ContentQueryService(tm, Clock.System)

            val page = service.getPublished(size = 50, type = ContentType.ARTICLE)

            assertTrue(page.items.all { it.type == ContentType.ARTICLE && it.state == ContentState.APPROVED })
        }
}
