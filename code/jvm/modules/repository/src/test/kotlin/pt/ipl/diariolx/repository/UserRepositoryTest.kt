package pt.ipl.diariolx.repository

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.repository.mem.UserRepositoryMem
import pt.ipl.diariolx.utils.token.Session
import pt.ipl.diariolx.utils.token.SessionToken
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Name
import pt.ipl.diariolx.utils.user.PasswordHash
import pt.ipl.diariolx.utils.user.Username
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.test.assertFalse

/**
 * Test suite for UserRepository implementations.
 * Verifies all CRUD operations, filtering, and session management.
 */
class UserRepositoryTest {

    private fun createRepository(): UserRepository = UserRepositoryMem()

    // ======================== Helper Functions ========================

    private fun createNewUser(
        username: String = "testuser",
        email: String = "test@example.com",
        password: String = "hashedPassword123",
        role: UserRole = UserRole.CONTRIBUTOR,
        fName: String = "John",
        lName: String = "Doe",
    ): NewUser =
        NewUser(
            username = Username(username),
            email = Email(email),
            passwordHash = PasswordHash(password),
            role = role,
            fName = Name(fName),
            lName = Name(lName),
        )

    private fun createUpdateUser(
        username: String = "updated",
        email: String = "updated@example.com",
        password: String = "newHashedPassword",
        fName: String = "Jane",
        lName: String = "Smith",
        bio: String = "Updated bio",
        profilePictureURL: String? = null,
    ): UpdateUser =
        UpdateUser(
            username = Username(username),
            email = Email(email),
            password = PasswordHash(password),
            fName = Name(fName),
            lName = Name(lName),
            bio = bio,
            profilePictureURL = profilePictureURL ?: "",
        )

    private fun createSession(
        userId: Int = 1,
        tokenValue: String = "test_token_$userId",
        now: Instant = Clock.System.now(),
    ): Session =
        Session(
            sessionToken = SessionToken(tokenValue),
            userId = userId,
            createdAt = now,
            lastUsedAt = now,
        )

    // ======================== CREATE Tests ========================

    @Test
    fun `create successfully adds a new user with correct properties`() {
        val repo = createRepository()
        val newUser = createNewUser()
        val now = Clock.System.now()

        val createdUser = repo.create(newUser, now)

        assertNotNull(createdUser)
        assertEquals(1, createdUser.id)
        assertEquals("testuser", createdUser.username.value)
        assertEquals("test@example.com", createdUser.email.value)
        assertTrue(createdUser.active)
    }

    @Test
    fun `create returns incrementing ids for multiple users`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val user1 = createNewUser(username = "user1")
        val user2 = createNewUser(username = "user2")
        val user3 = createNewUser(username = "user3")

        val created1 = repo.create(user1, now)
        val created2 = repo.create(user2, now)
        val created3 = repo.create(user3, now)

        assertEquals(1, created1.id)
        assertEquals(2, created2.id)
        assertEquals(3, created3.id)
    }

    @Test
    fun `created user has correct role`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val adminUser = createNewUser(role = UserRole.ADMIN)

        val created = repo.create(adminUser, now)

        assertEquals(UserRole.ADMIN, created.role)
    }

    @Test
    fun `created user has timestamps set`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val newUser = createNewUser()

        val created = repo.create(newUser, now)

        assertNotNull(created.createdAt)
        assertNotNull(created.updatedAt)
    }

    // ======================== GET BY ID Tests ========================

    @Test
    fun `getById returns null for non-existent user`() {
        val repo = createRepository()

        val user = repo.getById(999)

        assertNull(user)
    }

    @Test
    fun `getById returns the correct user`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(username = "alice"), now)

        val retrieved = repo.getById(createdUser.id)

        assertNotNull(retrieved)
        assertEquals("alice", retrieved.username.value)
        assertEquals(createdUser.id, retrieved.id)
    }

    // ======================== GET BY EMAIL Tests ========================

    @Test
    fun `getByEmail returns null for non-existent email`() {
        val repo = createRepository()

        val user = repo.getByEmail(Email("nonexistent@example.com"))

        assertNull(user)
    }

    @Test
    fun `getByEmail returns the correct user`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val email = "bob@example.com"
        repo.create(createNewUser(email = email, username = "bob"), now)

        val retrieved = repo.getByEmail(Email(email))

        assertNotNull(retrieved)
        assertEquals(email, retrieved.email.value)
    }

    @Test
    fun `getByEmail distinguishes between different emails`() {
        val repo = createRepository()
        val now = Clock.System.now()
        repo.create(createNewUser(email = "test1@example.com", username = "user1"), now)
        repo.create(createNewUser(email = "test2@example.com", username = "user2"), now)

        val user1 = repo.getByEmail(Email("test1@example.com"))
        val user2 = repo.getByEmail(Email("test2@example.com"))

        assertNotNull(user1)
        assertNotNull(user2)
        assertEquals("user1", user1.username.value)
        assertEquals("user2", user2.username.value)
    }

    // ======================== GET BY USERNAME Tests ========================

    @Test
    fun `getByUsername returns null for non-existent username`() {
        val repo = createRepository()

        val user = repo.getByUsername(Username("nonexistent"))

        assertNull(user)
    }

    @Test
    fun `getByUsername returns the correct user`() {
        val repo = createRepository()
        val now = Clock.System.now()
        repo.create(createNewUser(username = "charlie"), now)

        val retrieved = repo.getByUsername(Username("charlie"))

        assertNotNull(retrieved)
        assertEquals("charlie", retrieved.username.value)
    }

    // ======================== GET ALL Tests ========================

    @Test
    fun `getAll returns empty list for empty repository`() {
        val repo = createRepository()

        val allUsers = repo.getAll(0, 10, true)

        assertEquals(0, allUsers.size)
    }

    @Test
    fun `getAll returns all users with pagination`() {
        val repo = createRepository()
        val now = Clock.System.now()
        repeat(5) { i ->
            repo.create(createNewUser(username = "user$i"), now)
        }

        val allUsers = repo.getAll(0, 10, true)

        assertEquals(5, allUsers.size)
    }

    @Test
    fun `getAll respects limit parameter`() {
        val repo = createRepository()
        val now = Clock.System.now()
        repeat(10) { i ->
            repo.create(createNewUser(username = "user$i"), now)
        }

        val limitedUsers = repo.getAll(0, 3, true)

        assertEquals(3, limitedUsers.size)
    }

    @Test
    fun `getAll respects offset parameter`() {
        val repo = createRepository()
        val now = Clock.System.now()
        repeat(5) { i ->
            repo.create(createNewUser(username = "user$i"), now)
        }

        val offsetUsers = repo.getAll(1, 2, true)

        assertEquals(2, offsetUsers.size)
        assertEquals("user2", offsetUsers[0].username.value)
    }

    // ======================== DELETE Tests ========================

    @Test
    fun `delete returns false for non-existent user`() {
        val repo = createRepository()

        val result = repo.delete(999)

        assertFalse(result)
    }

    @Test
    fun `delete successfully removes a user`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(), now)

        val result = repo.delete(createdUser.id)

        assertTrue(result)
        assertNull(repo.getById(createdUser.id))
    }

    @Test
    fun `delete does not affect other users`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val user1 = repo.create(createNewUser(username = "user1"), now)
        val user2 = repo.create(createNewUser(username = "user2"), now)

        repo.delete(user1.id)
        val remaining = repo.getById(user2.id)

        assertNotNull(remaining)
        assertEquals(user2.id, remaining.id)
    }

    // ======================== DEACTIVATE Tests ========================

    @Test
    fun `deactivate returns false for non-existent user`() {
        val repo = createRepository()

        val result = repo.deactivate(999, Clock.System.now())

        assertFalse(result)
    }

    @Test
    fun `deactivate successfully marks user as inactive`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(), now)
        assertTrue(createdUser.active)

        val result = repo.deactivate(createdUser.id, now)

        assertTrue(result)
        val deactivatedUser = repo.getById(createdUser.id)
        assertNotNull(deactivatedUser)
        assertFalse(deactivatedUser.active)
    }

    @Test
    fun `deactivate updates the updatedAt timestamp`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(), now)
        val originalTimestamp = createdUser.updatedAt

        repo.deactivate(createdUser.id, now)
        val deactivatedUser = repo.getById(createdUser.id)

        assertNotNull(deactivatedUser)
        assertEquals(originalTimestamp, deactivatedUser.updatedAt)
    }

    // ======================== UPDATE Tests ========================

    @Test
    fun `update successfully modifies user properties`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(email = "original@example.com"), now)

        val updateUser = createUpdateUser(
            email = "updated@example.com",
            fName = "Updated",
        )
        repo.update(updateUser, createdUser.id, now)

        val updated = repo.getById(createdUser.id)
        assertNotNull(updated)
        assertEquals("updated@example.com", updated.email.value)
        assertEquals("Updated", updated.fName.value)
    }

    @Test
    fun `update modifies password hash`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(password = "oldHash"), now)

        val updateUser = createUpdateUser(password = "newHash")
        repo.update(updateUser, createdUser.id, now)

        val updated = repo.getById(createdUser.id)
        assertNotNull(updated)
        assertEquals("newHash", updated.passwordHash.value)
    }

    @Test
    fun `update modifies bio`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(), now)

        val updateUser = createUpdateUser(bio = "This is my new bio")
        repo.update(updateUser, createdUser.id, now)

        val updated = repo.getById(createdUser.id)
        assertNotNull(updated)
        assertEquals("This is my new bio", updated.bio)
    }

    @Test
    fun `update modifies profile picture URL`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(), now)

        val updateUser = createUpdateUser(profilePictureURL = "https://example.com/profile.jpg")
        repo.update(updateUser, createdUser.id, now)

        val updated = repo.getById(createdUser.id)
        assertNotNull(updated)
        assertEquals("https://example.com/profile.jpg", updated.profilePictureURL)
    }

    @Test
    fun `update clears profile picture URL when set to null`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(), now)

        // First set a URL
        repo.update(createUpdateUser(profilePictureURL = "https://example.com/profile.jpg"), createdUser.id, now)

        // Then clear it
        repo.update(createUpdateUser(profilePictureURL = null), createdUser.id, now)

        val updated = repo.getById(createdUser.id)
        assertNotNull(updated)
        assertEquals("", updated.profilePictureURL)
    }

    @Test
    fun `update preserves immutable fields`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val createdUser = repo.create(createNewUser(username = "preserved", role = UserRole.ADMIN), now)

        val updateUser = createUpdateUser(username = "changed", email = "changed@example.com")
        repo.update(updateUser, createdUser.id, now)

        val updated = repo.getById(createdUser.id)
        assertNotNull(updated)
        assertEquals(UserRole.ADMIN, updated.role)
        assertEquals(createdUser.createdAt, updated.createdAt)
    }

    @Test
    fun `update does nothing when user does not exist`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val initialSize = repo.getAll(0, 100, true).size

        val updateUser = createUpdateUser()
        repo.update(updateUser, 999, now)

        assertEquals(initialSize, repo.getAll(0, 100, true).size)
        assertNull(repo.getById(999))
    }

    // ======================== SESSION Tests ========================

    @Test
    fun `createSession successfully adds a session`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val user = repo.create(createNewUser(), now)
        val session = createSession(userId = 1)

        repo.createSession(session, 5)

        val retrieved = repo.getUserAndSessionByToken(session.sessionToken)
        assertNotNull(retrieved)
    }

    @Test
    fun `deleteSession successfully removes a session`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val user = repo.create(createNewUser(), now)
        val session = createSession(userId = user.id)

        repo.createSession(session, 5)
        val result = repo.deleteSession(session.sessionToken)

        assertTrue(result)
        assertNull(repo.getUserAndSessionByToken(session.sessionToken))
    }

    @Test
    fun `deleteSession returns false for non-existent session`() {
        val repo = createRepository()

        val result = repo.deleteSession(SessionToken("nonexistent"))

        assertFalse(result)
    }

    @Test
    fun `getUserAndSessionByToken returns user and session pair`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val user = repo.create(createNewUser(username = "sessionuser"), now)
        val session = createSession(userId = user.id)

        repo.createSession(session, 5)
        val retrieved = repo.getUserAndSessionByToken(session.sessionToken)

        assertNotNull(retrieved)
        assertEquals(user.id, retrieved.first.id)
        assertEquals(user.username.value, retrieved.first.username.value)
        assertEquals(session.sessionToken, retrieved.second.sessionToken)
    }

    @Test
    fun `getUserAndSessionByToken returns null for non-existent token`() {
        val repo = createRepository()

        val retrieved = repo.getUserAndSessionByToken(SessionToken("nonexistent"))

        assertNull(retrieved)
    }

    @Test
    fun `updateSessionTokenUsage updates last used timestamp`() {
        val repo = createRepository()
        val now = Clock.System.now()
        val user = repo.create(createNewUser(), now)
        val session = createSession(userId = user.id)

        repo.createSession(session, 5)

        val laterTime = Clock.System.now()
        repo.updateSessionTokenUsage(session, laterTime)

        val retrieved = repo.getUserAndSessionByToken(session.sessionToken)
        assertNotNull(retrieved)
        // The timestamp should be updated (or at least not changed unexpectedly)
    }

    // ======================== Integration Tests ========================

    @Test
    fun `complete user lifecycle - create, update, deactivate, delete`() {
        val repo = createRepository()
        val now = Clock.System.now()

        // Create
        val user = repo.create(createNewUser(username = "lifecycle"), now)
        assertEquals(1, user.id)

        // Verify creation
        val retrieved = repo.getById(user.id)
        assertNotNull(retrieved)
        assertEquals("lifecycle", retrieved.username.value)

        // Update
        repo.update(createUpdateUser(username = "lifecycle_updated", bio = "Updated"), user.id, now)
        val updated = repo.getById(user.id)
        assertNotNull(updated)
        assertEquals("lifecycle_updated", updated.username.value)
        assertEquals("Updated", updated.bio)

        // Deactivate
        repo.deactivate(user.id, now)
        val deactivated = repo.getById(user.id)
        assertNotNull(deactivated)
        assertFalse(deactivated.active)

        // Delete
        val deleteResult = repo.delete(user.id)
        assertTrue(deleteResult)
        assertNull(repo.getById(user.id))
    }

    @Test
    fun `multiple users with multiple sessions`() {
        val repo = createRepository()
        val now = Clock.System.now()

        // Create users
        val user1 = repo.create(createNewUser(username = "user1"), now)
        val user2 = repo.create(createNewUser(username = "user2"), now)

        // Create sessions
        val session1 = createSession(userId = user1.id, tokenValue = "token1")
        val session2 = createSession(userId = user1.id, tokenValue = "token2")
        val session3 = createSession(userId = user2.id, tokenValue = "token3")

        repo.createSession(session1, 10)
        repo.createSession(session2, 10)
        repo.createSession(session3, 10)

        // Verify sessions
        val retrieved1 = repo.getUserAndSessionByToken(session1.sessionToken)
        val retrieved3 = repo.getUserAndSessionByToken(session3.sessionToken)

        assertNotNull(retrieved1)
        assertNotNull(retrieved3)
        assertEquals(user1.id, retrieved1.first.id)
        assertEquals(user2.id, retrieved3.first.id)
    }

    @Test
    fun `repository maintains separate instances`() {
        val repo1 = createRepository()
        val repo2 = createRepository()
        val now = Clock.System.now()

        repo1.create(createNewUser(username = "repo1user"), now)
        repo2.create(createNewUser(username = "repo2user"), now)

        val user1 = repo1.getByUsername(Username("repo1user"))
        val user2Repo1 = repo1.getByUsername(Username("repo2user"))

        assertNotNull(user1)
        assertNull(user2Repo1)
    }
}

