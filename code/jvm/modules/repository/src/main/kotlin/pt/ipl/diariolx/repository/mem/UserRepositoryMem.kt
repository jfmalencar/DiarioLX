package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.repository.UserRepository
import pt.ipl.diariolx.utils.token.Session
import pt.ipl.diariolx.utils.token.SessionToken
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Username

class UserRepositoryMem : UserRepository {
    private val users = mutableListOf<User>()
    private val sessions = mutableListOf<Session>()
    private var currentId = 0

    override fun create(
        newUser: NewUser,
        now: Instant,
    ): User {
        val id = ++currentId
        val createdUser =
            User(
                id = id,
                username = newUser.username,
                email = newUser.email,
                passwordHash = newUser.passwordHash,
                role = newUser.role,
                fName = newUser.fName,
                lName = newUser.lName,
                createdAt = now,
                updatedAt = now,
            )
        users.addLast(createdUser)
        return createdUser
    }

    override fun update(
        updateUser: UpdateUser,
        userId: Int,
        now: Instant,
    ) {
        users.find { it.id == userId }?.let { user ->
            val updatedUser =
                user.copy(
                    username = updateUser.username,
                    email = updateUser.email,
                    passwordHash = updateUser.password,
                    fName = updateUser.fName,
                    lName = updateUser.lName,
                    bio = updateUser.bio,
                    profilePictureURL = updateUser.profilePictureURL,
                    updatedAt = now,
                )
            users.remove(user)
            users.add(updatedUser)
        }
    }

    override fun delete(id: Int): Boolean {
        if (users.none { it.id == id }) return false
        users.removeIf { it.id == id }
        return true
    }

    override fun deactivate(
        id: Int,
        now: Instant,
    ): Boolean {
        val user = users.find { it.id == id } ?: return false
        users.removeIf { it.id == id }
        users.add(user.copy(active = false, updatedAt = now))
        return true
    }

    override fun getById(id: Int): User? = users.find { it.id == id }

    override fun getByEmail(email: Email): User? = users.find { it.email == email }

    override fun getByUsername(username: Username): User? = users.find { it.username == username }

    override fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        deactivated: Boolean,
    ): List<User> {
        val users: List<User> = users.toList().drop((page * limit)).take(limit)
        return users.filter {
            !deactivated ||
                it.active &&
                (
                    if (query == null) {
                        true
                    } else {
                        it.fName.value.contains(query) ||
                            it.lName.value.contains(query) ||
                            it.username.value.contains(query)
                    }
                )
        }
    }

    /** Session Management **/

    override fun createSession(
        newSession: Session,
        maxTokens: Int,
    ) {
        val userSessions = sessions.filter { it.userId == newSession.userId }
        if (userSessions.size >= maxTokens) {
            val oldestSession = userSessions.minByOrNull { it.createdAt }
            if (oldestSession != null) {
                sessions.add(oldestSession)
            }
        }
        sessions.add(newSession)
    }

    override fun deleteSession(sessionToken: SessionToken): Boolean = sessions.removeIf { it.sessionToken == sessionToken }

    override fun updateSessionTokenUsage(
        session: Session,
        now: Instant,
    ) {
        sessions.find { it.sessionToken == session.sessionToken }?.let {
            val updatedSession = it.copy(lastUsedAt = now)
            sessions.remove(it)
            sessions.add(updatedSession)
        }
    }

    override fun getUserAndSessionByToken(sessionToken: SessionToken): Pair<User, Session>? =
        sessions.find { it.sessionToken == sessionToken }?.let { session ->
            users.find { user -> user.id == session.userId }?.let { user ->
                user to session
            }
        }
}
