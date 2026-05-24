package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import org.slf4j.Logger
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.auth.Session
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username
import pt.ipl.diariolx.repository.mappers.InstantMapper
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
        handle
            .createUpdate(
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

        return handle
            .createQuery(
                "SELECT * FROM users WHERE username = :username",
            ).bind("username", newUser.username.value)
            .mapTo<UserDBModel>()
            .single()
            .toUserDomain()
            .also { logger.info("Created User: $it") }
    }

    override fun update(
        updateUser: UpdateUser,
        userId: Int,
        now: Instant,
    ) {
        handle
            .createUpdate(
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
            handle
                .createUpdate(
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
            handle
                .createUpdate(
                    "UPDATE users SET active_account = false, updated_at = :updated_at WHERE id = :id",
                ).bind("id", id)
                .bind("updated_at", now.epochSeconds)
                .execute()
        return rowsAffected > 0
    }

    override fun getById(id: Int): User? =
        handle
            .createQuery(
                "SELECT * FROM users WHERE id = :id",
            ).bind("id", id)
            .mapTo<UserDBModel>()
            .singleOrNull()
            ?.toUserDomain()

    override fun getByEmail(email: Email): User? =
        handle
            .createQuery(
                "SELECT * FROM users WHERE email = :email",
            ).bind("email", email.value)
            .mapTo<UserDBModel>()
            .singleOrNull()
            ?.toUserDomain()

    override fun getByUsername(username: Username): User? =
        handle
            .createQuery(
                "SELECT * FROM users WHERE username = :username",
            ).bind("username", username.value)
            .mapTo<UserDBModel>()
            .singleOrNull()
            ?.toUserDomain()

    override fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        deactivated: Boolean,
    ): List<User> {
        val sql =
            buildString {
                append("select * from users WHERE 1 = 1".trimIndent())
                when (deactivated) {
                    true -> append(" AND active_account = false")
                    false -> append(" AND active_account = true")
                }
                if (query != null) {
                    append(" AND (first_name ILIKE :query OR last_name ILIKE :query OR username ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }

        return handle
            .createQuery(sql)
            .bind("offset", offset)
            .bind("limit", limit)
            .bind("query", "%$query%")
            .mapTo<UserDBModel>()
            .list()
            .map { it.toUserDomain() }
    }

    override fun createSession(
        newSession: Session,
        maxTokens: Int,
    ) {
        handle
            .createUpdate(
                """
        DELETE FROM sessions 
        WHERE user_id = :user_id 
            AND refresh_token IN (
                SELECT refresh_token FROM sessions 
                WHERE user_id = :user_id 
                ORDER BY created_at ASC 
                OFFSET :offset
            )
        """,
            ).bind("user_id", newSession.userId)
            .bind("offset", maxTokens - 1)
            .execute()

        handle
            .createUpdate(
                """
        INSERT INTO sessions (refresh_token, user_id, created_at, expires_at)
        VALUES (:refresh_token, :user_id, :created_at, :expires_at)
        """,
            ).bind("refresh_token", newSession.refreshToken.value)
            .bind("user_id", newSession.userId)
            .bind("created_at", newSession.createdAt.epochSeconds)
            .bind("expires_at", newSession.expiresAt.epochSeconds)
            .execute()
    }

    override fun deleteSession(refreshToken: RefreshToken): Boolean {
        val rowsAffected =
            handle
                .createUpdate(
                    "DELETE FROM sessions WHERE refresh_token = :refresh_token",
                ).bind("refresh_token", refreshToken.value)
                .execute()
        return rowsAffected > 0
    }

    override fun getSessionByRefreshToken(refreshToken: RefreshToken): Session? =
        handle
            .createQuery(
                "SELECT * FROM sessions WHERE refresh_token = :refresh_token",
            ).bind("refresh_token", refreshToken.value)
            .mapTo<SessionDBModel>()
            .singleOrNull()
            ?.toSessionDomain()

    private data class SessionDBModel(
        val id: Int,
        val refreshToken: String,
        val userId: Int,
        val createdAt: Instant,
        val expiresAt: Instant,
    ) {
        fun toSessionDomain(): Session =
            Session(
                refreshToken = RefreshToken(refreshToken),
                userId = userId,
                createdAt = createdAt,
                expiresAt = expiresAt,
            )
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
                    refreshToken = RefreshToken(rs.getString("session_token")),
                    userId = rs.getInt("user_id"),
                    createdAt = instantMapper.map(rs, rs.findColumn("created_at"), ctx),
                    expiresAt = instantMapper.map(rs, rs.findColumn("expires_at"), ctx),
                )
            return Pair(user, session)
        }
    }
}
