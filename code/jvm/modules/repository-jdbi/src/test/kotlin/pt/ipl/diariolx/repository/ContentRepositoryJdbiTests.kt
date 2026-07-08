package pt.ipl.diariolx.repository

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username
import pt.ipl.diariolx.testWithHandleAndRollback
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class ContentRepositoryJdbiTests {
    @Test
    fun `createEmpty creates a draft article owned by its author`(): Unit =
        testWithHandleAndRollback { handle ->
            val userRepo = JdbiUserRepository(handle)
            val contentRepo = JdbiContentRepository(handle)
            val now = Clock.System.now()

            // given: an author
            val author =
                userRepo.create(
                    NewUser(
                        username = Username("content-author"),
                        email = Email("content-author@diariolx.pt"),
                        passwordHash = PasswordHash("hash"),
                        firstName = Name("Rita"),
                        lastName = Name("Sousa"),
                        role = UserRole.CONTRIBUTOR,
                    ),
                    now,
                )

            // when: creating an empty article
            val id = contentRepo.createEmpty(ContentType.ARTICLE, author.id, now)

            // then: it exists as a draft article whose primary author is that user
            val content = contentRepo.getById(id)
            assertNotNull(content)
            assertEquals(ContentType.ARTICLE, content.type)
            assertEquals(ContentState.DRAFT, content.state)
            assertTrue(content.authors.any { it.id == author.id })
        }
}
