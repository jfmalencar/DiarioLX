package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.utils.token.SessionToken
import pt.ipl.diariolx.utils.token.Session
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Username

interface UserRepository {
    fun create(newUser: NewUser, now: Instant): User

    fun update(updateUser: UpdateUser, userId: Int, now: Instant)

    fun delete(id: Int): Boolean

    fun deactivate(id: Int, now: Instant): Boolean

    fun getById(id: Int): User?

    fun getByEmail(email: Email): User?

    fun getByUsername(username: Username): User?

    fun getAll(page: Int, limit: Int, deactivated: Boolean): List<User>

    fun createSession(newSession: Session, maxTokens: Int)

    fun deleteSession(sessionToken: SessionToken): Boolean

    fun updateSessionTokenUsage(session: Session, now: Instant)

    fun getUserAndSessionByToken(sessionToken: SessionToken): Pair<User, Session>?
}
