package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.testWithHandleAndRollback
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class CategoryRepositoryJdbiTests {
    @Test
    fun `can create and retrieve a category by id and slug`(): Unit =
        testWithHandleAndRollback { handle ->
            // given: a category repository
            val repo = JdbiCategoryRepository(handle)

            // when: creating a category
            val id =
                repo.create(
                    name = "Cultura",
                    slug = Slug("cat-jdbi-cultura"),
                    description = "desc",
                    color = Color("#abcdef"),
                    parentId = null,
                )

            // then: it can be fetched by id
            val byId = repo.getById(id)
            assertNotNull(byId)
            assertEquals("Cultura", byId.name)
            assertEquals("cat-jdbi-cultura", byId.slug.value)
            assertEquals("#abcdef", byId.color.value)

            // and: the same row is found by slug
            val bySlug = repo.getBySlug(Slug("cat-jdbi-cultura"))
            assertNotNull(bySlug)
            assertEquals(id, bySlug.id)
        }

    @Test
    fun `create sets the parent on a subcategory`(): Unit =
        testWithHandleAndRollback { handle ->
            // given: an existing parent category
            val repo = JdbiCategoryRepository(handle)
            val parentId =
                repo.create(
                    name = "Sociedade",
                    slug = Slug("cat-jdbi-sociedade"),
                    description = null,
                    color = Color("#000000"),
                    parentId = null,
                )

            // when: creating a subcategory under it
            val childId =
                repo.create(
                    name = "Educação",
                    slug = Slug("cat-jdbi-educacao"),
                    description = null,
                    color = Color("#ffffff"),
                    parentId = parentId,
                )

            // then: the subcategory reports its parent
            val child = repo.getById(childId)
            assertNotNull(child)
            assertEquals(parentId, child.parentId)
        }
}
