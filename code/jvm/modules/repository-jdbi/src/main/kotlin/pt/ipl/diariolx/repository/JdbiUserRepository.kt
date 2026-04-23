package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import org.slf4j.Logger
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.repository.mappers.InstantMapper
import pt.ipl.diariolx.utils.token.Session
import pt.ipl.diariolx.utils.token.SessionToken
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Name
import pt.ipl.diariolx.utils.user.PasswordHash
import pt.ipl.diariolx.utils.user.Username
import java.sql.ResultSet

class JdbiUserRepository(
    private val handle: Handle,
    private val logger: Logger,
) : UserRepository {
    override fun create(
        newUser: NewUser,
        now: Instant,
    ): User {
        logger.info("New User: $newUser")
        handle.createUpdate(
            """
            INSERT INTO users (username, email, password_hash, first_name, last_name, role, created_at, updated_at)
            VALUES (:username, :email, :password_hash, :first_name, :last_name, :role::user_role, :created_at, :updated_at)
            """,
        ).bind("username", newUser.username.value)
            .bind("email", newUser.email.value)
            .bind("password_hash", newUser.passwordHash.value)
            .bind("first_name", newUser.fName.value)
            .bind("last_name", newUser.lName.value)
            .bind("role", newUser.role.name)
            .bind("created_at", now.epochSeconds)
            .bind("updated_at", now.epochSeconds)
            .execute()

        return handle.createQuery(
            "SELECT * FROM users WHERE username = :username",
        ).bind("username", newUser.username.value)
            .mapTo<UserDBModel>()
            .single()
            .toUserDomain().also { logger.info("Created User: $it") }
    }

    override fun update(
        updateUser: UpdateUser,
        userId: Int,
        now: Instant,
    ) {
        handle.createUpdate(
            """
            UPDATE users 
            SET username = :username, 
                email = :email, 
                password_hash = :password_hash, 
                first_name = :first_name, 
                last_name = :last_name, 
                bio = :bio, 
                profile_picture_url = :profile_picture_url, 
                updated_at = :updated_at
            WHERE id = :userId
            """,
        ).bind("username", updateUser.username.value)
            .bind("email", updateUser.email.value)
            .bind("password_hash", updateUser.password.value)
            .bind("first_name", updateUser.fName.value)
            .bind("last_name", updateUser.lName.value)
            .bind("bio", updateUser.bio)
            .bind("profile_picture_url", updateUser.profilePictureURL)
            .bind("updated_at", now.epochSeconds)
            .bind("userId", userId)
            .execute()
    }

    override fun delete(id: Int): Boolean {
        val rowsAffected =
            handle.createUpdate(
                "DELETE FROM users WHERE id = :id",
            ).bind("id", id)
                .execute()
        return rowsAffected > 0
    }

    override fun deactivate(
        id: Int,
        now: Instant,
    ): Boolean {
        val rowsAffected =
            handle.createUpdate(
                "UPDATE users SET active_account = false, updated_at = :updated_at WHERE id = :id",
            ).bind("id", id)
                .bind("updated_at", now.epochSeconds)
                .execute()
        return rowsAffected > 0
    }

    override fun getById(id: Int): User? {
        return handle.createQuery(
            "SELECT * FROM users WHERE id = :id",
        ).bind("id", id)
            .mapTo<UserDBModel>()
            .singleOrNull()
            ?.toUserDomain()
    }

    override fun getByEmail(email: Email): User? {
        return handle.createQuery(
            "SELECT * FROM users WHERE email = :email",
        ).bind("email", email.value)
            .mapTo<UserDBModel>()
            .singleOrNull()
            ?.toUserDomain()
    }

    override fun getByUsername(username: Username): User? {
        return handle.createQuery(
            "SELECT * FROM users WHERE username = :username",
        ).bind("username", username.value)
            .mapTo<UserDBModel>()
            .singleOrNull()
            ?.toUserDomain()
    }

    override fun getAll(
        page: Int,
        limit: Int,
        deactivated: Boolean,
    ): List<User> {
        val whereClause = if (deactivated) "" else "WHERE active_account = true"
        return handle.createQuery(
            "SELECT * FROM users $whereClause ORDER BY id OFFSET :offset LIMIT :limit",
        ).bind("offset", page * limit)
            .bind("limit", limit)
            .mapTo<UserDBModel>()
            .list()
            .map { it.toUserDomain() }
    }

    override fun createSession(
        newSession: Session,
        maxTokens: Int,
    ) {
        // Delete the oldest token when achieved the maximum number of tokens
        handle.createUpdate(
            """
            DELETE FROM sessions 
            WHERE user_id = :user_id 
                AND session_token IN (
                    SELECT session_token FROM sessions 
                    WHERE user_id = :user_id 
                    ORDER BY created_at ASC 
                    OFFSET :offset
                )
            """,
        ).bind("user_id", newSession.userId)
            .bind("offset", maxTokens - 1)
            .execute()

        // Insert the new session
        handle.createUpdate(
            """
            INSERT INTO sessions (session_token, user_id, created_at, last_used_at)
            VALUES (:session_token, :user_id, :created_at, :last_used_at)
            """,
        ).bind("session_token", newSession.sessionToken.value)
            .bind("user_id", newSession.userId)
            .bind("created_at", newSession.createdAt.epochSeconds)
            .bind("last_used_at", newSession.lastUsedAt.epochSeconds)
            .execute()
    }

    override fun deleteSession(sessionToken: SessionToken): Boolean {
        val rowsAffected =
            handle.createUpdate(
                "DELETE FROM sessions WHERE session_token = :session_token",
            ).bind("session_token", sessionToken.value)
                .execute()
        return rowsAffected > 0
    }

    override fun updateSessionTokenUsage(
        session: Session,
        now: Instant,
    ) {
        handle.createUpdate(
            """
            UPDATE sessions 
            SET last_used_at = :last_used_at
            WHERE session_token = :session_token
            """,
        ).bind("last_used_at", now.epochSeconds)
            .bind("session_token", session.sessionToken.value)
            .execute()
    }

    override fun getUserAndSessionByToken(sessionToken: SessionToken): Pair<User, Session>? {
        return handle.createQuery(
            """
            SELECT u.id, u.username, u.email, u.password_hash, u.role, u.first_name, u.last_name, 
                   u.bio, u.created_at, u.updated_at, u.profile_picture_url, u.active_account,
                   t.session_token, t.user_id, t.created_at as token_created_at, t.last_used_at
            FROM users u
            JOIN sessions t ON u.id = t.user_id
            WHERE t.session_token = :session_token
            """,
        ).bind("session_token", sessionToken.value)
            .map(UserAndSessionMapper())
            .findOne()
            .orElse(null)
    }

    private data class UserDBModel(
        val id: Int,
        val username: String,
        val email: String,
        val passwordHash: String,
        val role: String,
        val firstName: String,
        val lastName: String,
        val bio: String,
        val createdAt: Instant,
        val updatedAt: Instant,
        val profilePictureURL: String?,
        val activeAccount: Boolean = true,
    ) {
        fun toUserDomain(): User =
            User(
                id = id,
                username = Username(username),
                email = Email(email),
                passwordHash = PasswordHash(passwordHash),
                role = UserRole.valueOf(role),
                fName = Name(firstName),
                lName = Name(lastName),
                bio = bio,
                createdAt = createdAt,
                updatedAt = updatedAt,
                profilePictureURL = profilePictureURL ?: "",
                active = activeAccount,
            )
    }

    private class UserAndSessionMapper : RowMapper<Pair<User, Session>> {
        override fun map(
            rs: ResultSet,
            ctx: StatementContext,
        ): Pair<User, Session> {
            val instantMapper = InstantMapper()
            val user =
                User(
                    id = rs.getInt("id"),
                    username = Username(rs.getString("username")),
                    email = Email(rs.getString("email")),
                    passwordHash = PasswordHash(rs.getString("password_hash")),
                    role = UserRole.valueOf(rs.getString("role")),
                    fName = Name(rs.getString("first_name")),
                    lName = Name(rs.getString("last_name")),
                    bio = rs.getString("bio"),
                    createdAt = instantMapper.map(rs, rs.findColumn("created_at"), ctx),
                    updatedAt = instantMapper.map(rs, rs.findColumn("updated_at"), ctx),
                    profilePictureURL = rs.getString("profile_picture_url") ?: "",
                    active = rs.getBoolean("active_account"),
                )
            val session =
                Session(
                    sessionToken = SessionToken(rs.getString("session_token")),
                    userId = rs.getInt("user_id"),
                    createdAt = instantMapper.map(rs, rs.findColumn("token_created_at"), ctx),
                    lastUsedAt = instantMapper.map(rs, rs.findColumn("last_used_at"), ctx),
                )
            return Pair(user, session)
        }
    }
}
