package pt.ipl.diariolx.repository

import kotlinx.datetime.Clock
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
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class UserRepositoryJdbiTests {
    private fun newUser(username: String) =
        NewUser(
            username = Username(username),
            email = Email("$username@diariolx.pt"),
            passwordHash = PasswordHash("hash"),
            firstName = Name("Ana"),
            lastName = Name("Silva"),
            role = UserRole.CONTRIBUTOR,
        )

    @Test
    fun `can create and retrieve a user`(): Unit =
        testWithHandleAndRollback { handle ->
            // given: a user repository
            val repo = JdbiUserRepository(handle)
            val now = Clock.System.now()

            // when: creating a user
            val created = repo.create(newUser("jdbi-create"), now)

            // then: it comes back with an id and the given data
            assertTrue(created.id > 0)
            assertEquals("jdbi-create", created.username.value)
            assertEquals("jdbi-create@diariolx.pt", created.email.value)

            // and: it can be retrieved by id
            val retrieved = repo.getById(created.id)
            assertNotNull(retrieved)
            assertEquals(created.username.value, retrieved.username.value)
            assertEquals(UserRole.CONTRIBUTOR, retrieved.role)
        }

    @Test
    fun `changeStatus deactivates a user`(): Unit =
        testWithHandleAndRollback { handle ->
            // given: an active user
            val repo = JdbiUserRepository(handle)
            val now = Clock.System.now()
            val created = repo.create(newUser("jdbi-status"), now)
            assertTrue(created.active)

            // when: deactivating it
            val changed = repo.changeStatus(created.id, now, isActive = false)

            // then: the operation succeeds, and the user is now inactive
            assertTrue(changed)
            val retrieved = repo.getById(created.id)
            assertNotNull(retrieved)
            assertFalse(retrieved.active)
        }

    @Test
    fun `hasContents is false for a user with no content`(): Unit =
        testWithHandleAndRollback { handle ->
            val repo = JdbiUserRepository(handle)
            val user = repo.create(newUser("jdbi-no-content"), Clock.System.now())

            assertFalse(repo.hasContents(user.id))
        }

    @Test
    fun `hasContents is true when the user authored content`(): Unit =
        testWithHandleAndRollback { handle ->
            val userRepo = JdbiUserRepository(handle)
            val contentRepo = JdbiContentRepository(handle)
            val now = Clock.System.now()

            // given: a user who authors a piece of content
            val user = userRepo.create(newUser("jdbi-has-content"), now)
            contentRepo.createEmpty(ContentType.ARTICLE, user.id, now)

            // then: hasContents reports true (this is what guards user deletion)
            assertTrue(userRepo.hasContents(user.id))
        }
}
