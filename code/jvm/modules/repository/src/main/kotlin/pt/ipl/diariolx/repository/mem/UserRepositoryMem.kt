package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.auth.Session
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Username
import pt.ipl.diariolx.repository.UserRepository

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
                firstName = newUser.firstName,
                lastName = newUser.lastName,
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
                    firstName = updateUser.fName,
                    lastName = updateUser.lName,
                    position = updateUser.position,
                    bio = updateUser.bio,
                    onTeam = updateUser.onTeam,
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
        limit: Int,
        offset: Int,
        query: String?,
        deactivated: Boolean,
        roles: List<UserRole>?,
    ): List<User> {
        val users: List<User> = users.toList().drop(offset).take(limit)
        return users.filter {
            !deactivated ||
                it.active &&
                (
                    if (query == null) {
                        true
                    } else {
                        it.firstName.value.contains(query) ||
                            it.lastName.value.contains(query) ||
                            it.username.value.contains(query)
                    }
                )
        }
    }

    override fun getTeam(): List<User> = users.filter { it.onTeam && it.active }

    override fun setTeamMembership(
        userId: Int,
        onTeam: Boolean,
        now: Instant,
    ): Boolean {
        val user = users.find { it.id == userId } ?: return false
        users.remove(user)
        users.add(user.copy(onTeam = onTeam, updatedAt = now))
        return true
    }

    override fun updateAvatar(
        userId: Int,
        mediaId: Int,
    ) = true

    override fun completeAvatarUpload(userId: Int): Boolean = true

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

    override fun getSessionByRefreshToken(refreshToken: RefreshToken): Session? = sessions.find { it.refreshToken == refreshToken }

    override fun deleteSession(refreshToken: RefreshToken): Boolean = sessions.removeIf { it.refreshToken == refreshToken }
}
