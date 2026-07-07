package pt.ipl.diariolx.services

import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.testWithTransactionManagerAndRollback
import pt.ipl.diariolx.utils.CategoryError
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class CategoryServiceTest {
    @Test
    fun `create fails when name is empty`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result =
                service.create(
                    name = "",
                    slug = "svc-politica",
                    description = "desc",
                    color = "#ffffff",
                    parentId = null,
                )

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.EmptyName, failure.value)
        }

    @Test
    fun `create fails when slug is invalid`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result =
                service.create(
                    name = "Política",
                    slug = "Política",
                    description = "desc",
                    color = "#ffffff",
                    parentId = null,
                )

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.InvalidSlug, failure.value)
        }

    @Test
    fun `create fails when color is invalid`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result =
                service.create(
                    name = "Política",
                    slug = "svc-politica",
                    description = "desc",
                    color = "blue",
                    parentId = null,
                )

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.InvalidColor, failure.value)
        }

    @Test
    fun `create fails when slug already exists`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            service.create(
                name = "Política",
                slug = "svc-dup",
                description = null,
                color = "#ffffff",
                parentId = null,
            )

            val result =
                service.create(
                    name = "Outra",
                    slug = "svc-dup",
                    description = "desc",
                    color = "#000000",
                    parentId = null,
                )

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.SlugAlreadyExists, failure.value)
        }

    @Test
    fun `create fails when parent does not exist`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result =
                service.create(
                    name = "Saúde",
                    slug = "svc-saude",
                    description = "desc",
                    color = "#ffffff",
                    parentId = 999_999,
                )

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.InvalidParent, failure.value)
        }

    @Test
    fun `create succeeds when input is valid`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result =
                service.create(
                    name = "Cultura",
                    slug = "svc-cultura",
                    description = "desc",
                    color = "#abcdef",
                    parentId = null,
                )

            val success = assertIs<Success<Int>>(result)
            val created = assertIs<Success<Category>>(service.get(success.value)).value

            assertEquals("Cultura", created.name)
            assertEquals("svc-cultura", created.slug.value)
            assertEquals("#abcdef", created.color.value)
        }

    @Test
    fun `get returns category when it exists`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val id =
                (
                    service.create(
                        name = "Cultura",
                        slug = "svc-cultura",
                        description = "desc",
                        color = "#ffffff",
                        parentId = null,
                    ) as Success
                ).value

            val result = service.get(id)

            val success = assertIs<Success<Category>>(result)
            assertEquals(id, success.value.id)
            assertEquals("Cultura", success.value.name)
        }

    @Test
    fun `get returns failure when category does not exist`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result = service.get(999_999)

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.CategoryNotFound, failure.value)
        }

    @Test
    fun `getAll returns matching categories`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            service.create("Cultura", "svc-getall-a", null, "#ffffff", null)
            service.create("Sociedade", "svc-getall-b", null, "#000000", null)

            // Filter by a token only these two share, so the seed categories don't affect the count.
            val result = service.getAll(page = 1, 10, query = "svc-getall-", archived = false)

            assertEquals(2, result.items.size)
        }

    @Test
    fun `delete returns success when category exists`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val id =
                (
                    service.create(
                        name = "Cultura",
                        slug = "svc-del",
                        description = null,
                        color = "#ffffff",
                        parentId = null,
                    ) as Success
                ).value

            val result = service.delete(id)

            assertIs<Success<Unit>>(result)

            val getResult = service.get(id)
            assertIs<Failure<CategoryError>>(getResult)
        }

    @Test
    fun `delete returns failure when category does not exist`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val result = service.delete(999_999)

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.CategoryNotFound, failure.value)
        }

    @Test
    fun `update succeeds when data is valid`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val id =
                assertIs<Success<Int>>(
                    service.create(
                        name = "Cultura",
                        slug = "svc-cultura",
                        description = null,
                        color = "#ffffff",
                        parentId = null,
                    ),
                ).value

            val result =
                service.update(
                    id = id,
                    name = "Cultura Updated",
                    slug = "svc-cultura-updated",
                    description = "nova desc",
                    color = "#000000",
                    parentId = null,
                )

            assertIs<Success<Unit>>(result)

            val updated = assertIs<Success<Category>>(service.get(id)).value
            assertEquals("Cultura Updated", updated.name)
            assertEquals("svc-cultura-updated", updated.slug.value)
            assertEquals("nova desc", updated.description)
            assertEquals("#000000", updated.color.value)
        }

    @Test
    fun `update fails when slug already exists`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = CategoryService(tm)

            val id1 =
                assertIs<Success<Int>>(
                    service.create(
                        name = "Cultura",
                        slug = "svc-cultura",
                        description = null,
                        color = "#ffffff",
                        parentId = null,
                    ),
                ).value

            val id2 =
                (
                    service.create(
                        name = "Sociedade",
                        slug = "svc-sociedade",
                        description = null,
                        color = "#000000",
                        parentId = null,
                    ) as Success
                ).value

            val result =
                service.update(
                    id = id2,
                    name = "Sociedade",
                    slug = "svc-cultura",
                    description = null,
                    color = "#000000",
                    parentId = null,
                )

            val failure = assertIs<Failure<CategoryError>>(result)
            assertEquals(CategoryError.SlugAlreadyExists, failure.value)

            val unchanged = assertIs<Success<Category>>(service.get(id2)).value
            assertEquals("svc-sociedade", unchanged.slug.value)
            assertEquals(id1, (service.get(id1) as Success<Category>).value.id)
        }
}
