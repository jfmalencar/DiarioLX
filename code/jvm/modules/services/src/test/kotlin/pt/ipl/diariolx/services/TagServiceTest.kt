package pt.ipl.diariolx.services

import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.testWithTransactionManagerAndRollback
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success
import pt.ipl.diariolx.utils.TagError
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class TagServiceTest {
    @Test
    fun `create succeeds and can be read back`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = TagService(tm)

            val result =
                service.create(
                    name = "Tecnologia",
                    slug = "tag-tech",
                    description = "desc",
                )

            val success = assertIs<Success<Int>>(result)
            val fetched = assertIs<Success<Tag>>(service.get(success.value)).value
            assertEquals("Tecnologia", fetched.name)
            assertEquals("tag-tech", fetched.slug.value)
        }

    @Test
    fun `create fails when slug already exists`(): Unit =
        testWithTransactionManagerAndRollback { tm ->
            val service = TagService(tm)

            service.create(name = "Tecnologia", slug = "tag-dup", description = null)

            val result = service.create(name = "Outra", slug = "tag-dup", description = null)

            val failure = assertIs<Failure<TagError>>(result)
            assertEquals(TagError.SlugAlreadyExists, failure.value)
        }
}
