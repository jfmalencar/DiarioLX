package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
import kotlinx.datetime.DateTimeUnit
import kotlinx.datetime.plus
import org.slf4j.Logger
import org.springframework.security.crypto.password.PasswordEncoder
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.auth.JwtConfig
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.auth.Session
import pt.ipl.diariolx.domain.auth.UserTokens
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.media.NewMedia
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.config.UsersDomainConfig
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.Password
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.storage.FileStorage
import pt.ipl.diariolx.utils.AuthError
import pt.ipl.diariolx.utils.LoginResult
import pt.ipl.diariolx.utils.UserCreateResult
import pt.ipl.diariolx.utils.UserError
import pt.ipl.diariolx.utils.UserResult
import pt.ipl.diariolx.utils.UserUpdateResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success
import pt.ipl.diariolx.utils.token.TokenGenerator

@Named
class UserService(
    private val transactionManager: TransactionManager,
    private val config: UsersDomainConfig,
    private val passwordEncoder: PasswordEncoder,
    private val tokenGenerator: TokenGenerator,
    private val fileStorage: FileStorage,
    private val jwtConfig: JwtConfig,
    private val clock: Clock.System,
    private val logger: Logger,
) {
    fun create(
        username: String?,
        email: String?,
        password: String?,
        firstName: String?,
        lastName: String?,
        invite: Invite,
    ): UserCreateResult {
        logger.info(
            "Creating new user: $username, email: $email, password: $password, firstName: $firstName, " +
                "lastName: $lastName, invite: ${invite.invite}",
        )
        val username = Username.parse(username) ?: return failure(UserError.InvalidUsername)
        val email = Email.parse(email) ?: return failure(UserError.InvalidEmail)
        val password = Password.parse(password) ?: return failure(UserError.InvalidPassword)
        val passwordHash = PasswordHash(passwordEncoder.encode(password.value))
        val firstName = Name.parse(firstName) ?: return failure(UserError.InvalidName)
        val lastName = Name.parse(lastName) ?: return failure(UserError.InvalidName)

        return transactionManager.run { tx ->
            val newUser = NewUser(username, email, passwordHash, firstName, lastName, invite.role)
            val user = tx.userRepository.create(newUser, clock.now())
            if (!tx.inviteRepository.consumeInvite(invite.id)) {
                return@run failure(UserError.InvalidInvite)
            }
            success(user.id)
        }
    }

    fun update(
        oldUser: User,
        username: String?,
        email: String?,
        password: String?,
        firstName: String?,
        lastName: String?,
        position: String?,
        bio: String?,
        onTeam: Boolean?,
    ): UserUpdateResult {
        logger.info(
            "Updating user ${oldUser.id}: new username: $username, new email: $email, new password: $password, " +
                "new firstName: $firstName, new lastName: $lastName, new bio: $bio",
        )

        val username = Username.parse(username) ?: return failure(UserError.InvalidUsername)
        val email = Email.parse(email) ?: return failure(UserError.InvalidEmail)
        val passwordHash =
            if (password != null) {
                val pw = Password.parse(password) ?: return failure(UserError.InvalidPassword)
                PasswordHash(passwordEncoder.encode(pw.value))
            } else {
                oldUser.passwordHash
            }
        val firstName = Name.parse(firstName) ?: return failure(UserError.InvalidName)
        val lastName = Name.parse(lastName) ?: return failure(UserError.InvalidName)
        val position = position ?: oldUser.position
        val bio = bio ?: oldUser.bio
        val onTeam = onTeam ?: oldUser.onTeam

        return transactionManager.run { tx ->
            if (username != oldUser.username) {
                val existingUser = tx.userRepository.getByUsername(username)
                if (existingUser != null) {
                    return@run failure(UserError.UsernameAlreadyExists)
                }
            }
            if (email != oldUser.email) {
                val existingUser = tx.userRepository.getByEmail(email)
                if (existingUser != null) {
                    return@run failure(UserError.EmailAlreadyExists)
                }
            }

            val updatedUser = UpdateUser(username, email, passwordHash, firstName, lastName, position, bio, onTeam)
            tx.userRepository.update(updatedUser, oldUser.id, clock.now())
            success(Unit)
        }
    }

    fun getTeam(): List<User> = transactionManager.run { it.userRepository.getTeam() }

    fun getByUsername(username: String): User? =
        transactionManager.run { tx ->
            Username.parse(username)?.let { tx.userRepository.getByUsername(it) }
        }

    fun setTeamMembership(
        userId: Int,
        onTeam: Boolean,
    ): Boolean = transactionManager.run { it.userRepository.setTeamMembership(userId, onTeam, clock.now()) }

    fun get(
        me: User,
        id: Int,
    ): UserResult =
        transactionManager.run {
            if (!me.active) {
                return@run failure(UserError.DeactivatedAccount)
            }
            logger.info("Getting user by id: $id")
            val user = it.userRepository.getById(id)
            if (user == null) {
                return@run failure(UserError.UserNotFound)
            } else {
                return@run success(user)
            }
        }

    fun getAll(
        page: Int,
        size: Int,
        query: String?,
        deactivated: Boolean,
        roles: List<UserRole>?,
    ): PageResponse<User> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.userRepository.getAll(limit, offset, query, deactivated, roles)
            }
        }

    fun delete(
        author: User,
        id: Int,
    ): UserUpdateResult =
        transactionManager.run {
            if (!author.active) {
                return@run failure(UserError.DeactivatedAccount)
            }
            logger.info("Deleting user by id: $id; author: ${author.username}")
            if (author.id == id || author.role == UserRole.ADMIN) {
                if (it.userRepository.hasContents(id)) {
                    return@run failure(UserError.UserHasContents)
                }
                val result = it.userRepository.delete(id)
                if (result) {
                    return@run success(Unit)
                } else {
                    return@run failure(UserError.UserNotFound)
                }
            } else {
                return@run failure(UserError.Unauthorized)
            }
        }

    fun manageAccountStatus(
        author: User,
        id: Int,
        isActive: Boolean,
    ): UserUpdateResult =
        transactionManager.run {
            if (!author.active) {
                return@run failure(UserError.DeactivatedAccount)
            }
            if (author.role == UserRole.ADMIN && author.id != id) {
                val result = it.userRepository.changeStatus(id, clock.now(), isActive)
                if (result) {
                    return@run success(Unit)
                } else {
                    return@run failure(UserError.UserNotFound)
                }
            } else {
                return@run failure(UserError.Unauthorized)
            }
        }

    fun login(
        username: String,
        password: String,
    ): LoginResult {
        logger.info("Logging in user: $username; password: $password")
        val username = Username.parse(username) ?: return failure(AuthError.InvalidCredentials)
        val password = Password.parse(password) ?: return failure(AuthError.InvalidCredentials)

        return transactionManager.run {
            val user =
                it.userRepository.getByUsername(username)
                    ?: return@run failure(AuthError.InvalidCredentials)
            if (!user.active) {
                return@run failure(AuthError.DeactivatedAccount)
            }
            if (!verifyPasswordMatch(password.value, user.passwordHash)) {
                return@run failure(AuthError.InvalidCredentials)
            }

            val refreshToken = tokenGenerator.generateRefreshToken()
            val session = createSession(user, refreshToken)
            it.userRepository.createSession(session, config.maxTokensPerUser)

            val accessToken = tokenGenerator.generateAccessToken(user.id, user.role)
            success(UserTokens(accessToken, refreshToken.value))
        }
    }

    fun refresh(refreshToken: RefreshToken?): LoginResult {
        if (refreshToken == null) {
            return failure(AuthError.InvalidCredentials)
        }
        return transactionManager.run {
            val session =
                it.userRepository.getSessionByRefreshToken(refreshToken)
                    ?: return@run failure(AuthError.InvalidCredentials)

            val now = clock.now()
            if (now > session.expiresAt) {
                it.userRepository.deleteSession(refreshToken)
                return@run failure(AuthError.InvalidCredentials)
            }

            val user =
                it.userRepository.getById(session.userId)
                    ?: return@run failure(AuthError.InvalidCredentials)

            if (!user.active) {
                return@run failure(AuthError.DeactivatedAccount)
            }

            val accessToken = tokenGenerator.generateAccessToken(user.id, user.role)
            success(UserTokens(accessToken, refreshToken.value))
        }
    }

    fun verifyPasswordMatch(
        loginPassword: String,
        realPasswordInfo: PasswordHash,
    ): Boolean = passwordEncoder.matches(loginPassword, realPasswordInfo.value)

    fun logout(refreshToken: RefreshToken): Boolean =
        transactionManager.run {
            it.userRepository.deleteSession(refreshToken)
            true
        }

    fun getUserById(id: Int): User? =
        transactionManager.run {
            it.userRepository.getById(id)
        }

    fun completeAvatarUpload(
        id: Int,
        user: User,
    ): Boolean {
        val media =
            transactionManager.run {
                it.mediaRepository.get(id)
            } ?: return false

        val info = fileStorage.getObjectInfo(media.bucket, media.objectKey) ?: return false
        transactionManager.run {
            it.mediaRepository.completeUpload(NewMedia(id, info.sizeBytes))
            it.userRepository.updateAvatar(user.id, id)
            user.avatar?.let { old -> it.mediaRepository.delete(old.id) }
        }

        user.avatar?.let {
            fileStorage.delete(it.bucket, it.objectKey)
        }
        return true
    }

    private fun createSession(
        user: User,
        refreshToken: RefreshToken,
    ): Session {
        val now = clock.now()
        val expiresAt = now.plus(jwtConfig.refreshTokenExpirationMs, DateTimeUnit.MILLISECOND)
        return Session(
            userId = user.id,
            refreshToken = refreshToken,
            createdAt = now,
            expiresAt = expiresAt,
        )
    }
}
