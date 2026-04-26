package pt.ipl.diariolx.services

import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.repository.mem.ArticleRepositoryMem
import pt.ipl.diariolx.repository.mem.CategoryRepositoryMem
import pt.ipl.diariolx.repository.mem.FileRepositoryMem
import pt.ipl.diariolx.repository.mem.InviteRepositoryMem
import pt.ipl.diariolx.repository.mem.TagRepositoryMem
import pt.ipl.diariolx.repository.mem.TransactionManagerMem
import pt.ipl.diariolx.repository.mem.UserRepositoryMem
import pt.ipl.diariolx.utils.CategoryError
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class CategoryServiceTest {
    @Test
    fun `create fails when name is empty`() {
        val service = createService()

        val result =
            service.create(
                name = "",
                slug = "politica",
                description = "desc",
                color = "#ffffff",
                parentId = null,
            )

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.EmptyName, failure.value)
    }

    @Test
    fun `create fails when slug is invalid`() {
        val service = createService()

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
    fun `create fails when color is invalid`() {
        val service = createService()

        val result =
            service.create(
                name = "Política",
                slug = "politica",
                description = "desc",
                color = "blue",
                parentId = null,
            )

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.InvalidColor, failure.value)
    }

    @Test
    fun `create fails when slug already exists`() {
        val service = createService()

        service.create(
            name = "Política",
            slug = "politica",
            description = null,
            color = "#ffffff",
            parentId = null,
        )

        val result =
            service.create(
                name = "Outra",
                slug = "politica",
                description = "desc",
                color = "#000000",
                parentId = null,
            )

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.SlugAlreadyExists, failure.value)
    }

    @Test
    fun `create fails when parent does not exist`() {
        val service = createService()

        val result =
            service.create(
                name = "Saúde",
                slug = "saude",
                description = "desc",
                color = "#ffffff",
                parentId = 999,
            )

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.ParentNotFound, failure.value)
    }

    @Test
    fun `create succeeds when input is valid`() {
        val service = createService()
        val result =
            service.create(
                name = "Cultura",
                slug = "cultura",
                description = "desc",
                color = "#abcdef",
                parentId = null,
            )

        val success = assertIs<Success<Int>>(result)
        val category = service.get(success.value)
        assertIs<Success<Category>>(category)
        val created = category.value

        assertEquals("Cultura", created.name)
        assertEquals("cultura", created.slug)
        assertEquals("#abcdef", created.color)
    }

    @Test
    fun `get returns category when it exists`() {
        val service = createService()

        val id =
            (
                service.create(
                    name = "Cultura",
                    slug = "cultura",
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
    fun `get returns failure when category does not exist`() {
        val service = createService()

        val result = service.get(999)

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.CategoryNotFound, failure.value)
    }

    @Test
    fun `getAll returns all categories`() {
        val service = createService()

        service.create("Cultura", "cultura", null, "#ffffff", null)
        service.create("Sociedade", "sociedade", null, "#000000", null)

        val result = service.getAll(page = 1, limit = 10, query = null, archived = false)

        assertEquals(2, result.size)
    }

    @Test
    fun `delete returns success when category exists`() {
        val service = createService()

        val id =
            (
                service.create(
                    name = "Cultura",
                    slug = "cultura",
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
    fun `delete returns failure when category does not exist`() {
        val service = createService()

        val result = service.delete(999)

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.CategoryNotFound, failure.value)
    }

    @Test
    fun `update succeeds when data is valid`() {
        val service = createService()

        val id =
            (
                service.create(
                    name = "Cultura",
                    slug = "cultura",
                    description = null,
                    color = "#ffffff",
                    parentId = null,
                ) as Success
            ).value

        val result =
            service.update(
                id = id,
                name = "Cultura Updated",
                slug = "cultura-updated",
                description = "nova desc",
                color = "#000000",
                parentId = null,
            )

        assertIs<Success<Unit>>(result)

        val updated = (service.get(id) as Success<Category>).value
        assertEquals("Cultura Updated", updated.name)
        assertEquals("cultura-updated", updated.slug)
        assertEquals("nova desc", updated.description)
        assertEquals("#000000", updated.color)
    }

    @Test
    fun `update fails when slug already exists`() {
        val service = createService()

        val id1 =
            (
                service.create(
                    name = "Cultura",
                    slug = "cultura",
                    description = null,
                    color = "#ffffff",
                    parentId = null,
                ) as Success
            ).value

        val id2 =
            (
                service.create(
                    name = "Sociedade",
                    slug = "sociedade",
                    description = null,
                    color = "#000000",
                    parentId = null,
                ) as Success
            ).value

        val result =
            service.update(
                id = id2,
                name = "Sociedade",
                slug = "cultura",
                description = null,
                color = "#000000",
                parentId = null,
            )

        val failure = assertIs<Failure<CategoryError>>(result)
        assertEquals(CategoryError.SlugAlreadyExists, failure.value)

        val unchanged = (service.get(id2) as Success<Category>).value
        assertEquals("sociedade", unchanged.slug)
        assertEquals(id1, (service.get(id1) as Success<Category>).value.id)
    }

    companion object {
        fun createService(
            repo: CategoryRepositoryMem = CategoryRepositoryMem(),
            tagRepo: TagRepositoryMem = TagRepositoryMem(),
            userRepo: UserRepositoryMem = UserRepositoryMem(),
            inviteRepo: InviteRepositoryMem = InviteRepositoryMem(),
            articleRepo: ArticleRepositoryMem = ArticleRepositoryMem(),
            fileRepo: FileRepositoryMem = FileRepositoryMem(),
        ): CategoryService = CategoryService(TransactionManagerMem(repo, userRepo, inviteRepo, tagRepo, articleRepo, fileRepo))
    }
}
