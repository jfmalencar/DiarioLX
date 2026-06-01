package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.auth.Session
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Username

interface UserRepository {
    fun create(
        newUser: NewUser,
        now: Instant,
    ): User

    fun update(
        updateUser: UpdateUser,
        userId: Int,
        now: Instant,
    )

    fun updateAvatar(
        userId: Int,
        mediaId: Int,
    ): Boolean

    fun delete(id: Int): Boolean

    fun deactivate(
        id: Int,
        now: Instant,
    ): Boolean

    fun getById(id: Int): User?

    fun getByEmail(email: Email): User?

    fun getByUsername(username: Username): User?

    fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        deactivated: Boolean,
    ): List<User>

    fun completeAvatarUpload(userId: Int): Boolean

    fun createSession(
        newSession: Session,
        maxTokens: Int,
    )

    fun getSessionByRefreshToken(refreshToken: RefreshToken): Session?

    fun deleteSession(refreshToken: RefreshToken): Boolean
}
