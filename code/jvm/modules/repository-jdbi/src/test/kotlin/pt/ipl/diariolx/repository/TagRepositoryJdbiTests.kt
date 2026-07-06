package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.testWithHandleAndRollback
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class TagRepositoryJdbiTests {
    @Test
    fun `can create and retrieve a tag by id and slug`(): Unit =
        testWithHandleAndRollback { handle ->
            // given: a tag repository
            val repo = JdbiTagRepository(handle)

            // when: creating a tag
            val id = repo.create(name = "Tecnologia", slug = Slug("tag-jdbi-tech"), description = "desc")

            // then: it can be fetched by id
            val byId = repo.getById(id)
            assertNotNull(byId)
            assertEquals("Tecnologia", byId.name)
            assertEquals("tag-jdbi-tech", byId.slug.value)

            // and: the same row is found by slug
            val bySlug = repo.getBySlug(Slug("tag-jdbi-tech"))
            assertNotNull(bySlug)
            assertEquals(id, bySlug.id)
        }

    @Test
    fun `delete removes a tag`(): Unit =
        testWithHandleAndRollback { handle ->
            // given: an existing tag
            val repo = JdbiTagRepository(handle)
            val id = repo.create(name = "Efémera", slug = Slug("tag-jdbi-del"), description = null)

            // when: deleting it
            val deleted = repo.delete(id)

            // then: it is gone, and deleting again reports nothing removed
            assertTrue(deleted)
            assertNull(repo.getById(id))
            assertFalse(repo.delete(id))
        }
}
