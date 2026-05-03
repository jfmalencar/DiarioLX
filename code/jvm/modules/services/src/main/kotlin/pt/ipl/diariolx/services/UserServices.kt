package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import org.slf4j.Logger
import org.springframework.security.crypto.password.PasswordEncoder
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.config.UsersDomainConfig
import pt.ipl.diariolx.domain.users.internal.NewUser
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.LoginError
import pt.ipl.diariolx.utils.LoginResult
import pt.ipl.diariolx.utils.UserCreateResult
import pt.ipl.diariolx.utils.UserError
import pt.ipl.diariolx.utils.UserResult
import pt.ipl.diariolx.utils.UserUpdateResult
import pt.ipl.diariolx.utils.UsersResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.success
import pt.ipl.diariolx.utils.token.LoginResultOutput
import pt.ipl.diariolx.utils.token.Session
import pt.ipl.diariolx.utils.token.TokenEncoder
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Name
import pt.ipl.diariolx.utils.user.PasswordHash
import pt.ipl.diariolx.utils.user.Username
import pt.ipl.diariolx.utils.user.isEmailValid
import pt.ipl.diariolx.utils.user.isNameValid
import pt.ipl.diariolx.utils.user.isPasswordValid
import pt.ipl.diariolx.utils.user.isUsernameValid
import java.security.SecureRandom
import java.util.Base64.getUrlDecoder
import java.util.Base64.getUrlEncoder

@Named
class UserServices(
    private val transactionManager: TransactionManager,
    private val config: UsersDomainConfig,
    private val passwordEncoder: PasswordEncoder,
    private val tokenEncoder: TokenEncoder,
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
        val username =
            username?.let {
                if (it.isUsernameValid()) {
                    Username(it)
                } else {
                    return failure(UserError.InvalidUsername)
                }
            } ?: return failure(UserError.InvalidUsername)

        val email =
            email?.let {
                if (it.isEmailValid()) {
                    Email(it)
                } else {
                    return failure(UserError.InvalidEmail)
                }
            } ?: return failure(UserError.InvalidEmail)

        val password =
            password?.let {
                if (it.isPasswordValid()) {
                    PasswordHash(passwordEncoder.encode(it))
                } else {
                    return failure(UserError.InvalidPassword)
                }
            } ?: return failure(UserError.InvalidPassword)

        val fName =
            firstName?.let {
                if (it.isNameValid()) {
                    Name(it)
                } else {
                    return failure(UserError.InvalidName)
                }
            } ?: return failure(UserError.InvalidName)

        val lName =
            lastName?.let {
                if (it.isNameValid()) {
                    Name(it)
                } else {
                    return failure(UserError.InvalidName)
                }
            } ?: return failure(UserError.InvalidName)

        return transactionManager.run { tx ->
            val newUser = NewUser(username, email, password, fName, lName, invite.role)
            val user = tx.userRepository.create(newUser, clock.now())
            if (!tx.inviteRepository.consumeInvite(invite.id)) {
                println("Invite not consumed")
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
        bio: String?,
        profilePictureURL: String?,
    ): UserUpdateResult {
        logger.info(
            "Updating user ${oldUser.id}: new username: $username, new email: $email, new password: $password, " +
                "new firstName: $firstName, new lastName: $lastName, new bio: $bio, new profilePictureURL: $profilePictureURL",
        )
        val username =
            username?.let {
                if (it.isUsernameValid()) {
                    Username(it)
                } else {
                    return failure(UserError.InvalidUsername)
                }
            } ?: oldUser.username

        val email =
            email?.let {
                if (it.isEmailValid()) {
                    Email(it)
                } else {
                    return failure(UserError.InvalidEmail)
                }
            } ?: oldUser.email

        val password =
            password?.let {
                if (it.isPasswordValid()) {
                    PasswordHash(passwordEncoder.encode(it))
                } else {
                    return failure(UserError.InvalidPassword)
                }
            } ?: oldUser.passwordHash

        val fName =
            firstName?.let {
                if (it.isNameValid()) {
                    Name(it)
                } else {
                    return failure(UserError.InvalidName)
                }
            } ?: oldUser.fName

        val lName =
            lastName?.let {
                if (it.isNameValid()) {
                    Name(it)
                } else {
                    return failure(UserError.InvalidName)
                }
            } ?: oldUser.lName

        val bio = bio ?: oldUser.bio

        val profilePictureURL = profilePictureURL ?: oldUser.profilePictureURL

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

            val updatedUser = UpdateUser(username, email, password, fName, lName, bio, profilePictureURL)
            tx.userRepository.update(updatedUser, oldUser.id, clock.now())
            success(Unit)
        }
    }

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
        // me: User,
        offset: Int,
        limit: Int,
        query: String?,
        deactivated: Boolean,
    ): UsersResult =
        transactionManager.run {
            // if (!me.active) {
            //     return@run failure(UserError.DeactivatedAccount)
            // }
            logger.info("Getting all users: offset: $offset, limit: $limit, deactivated: $deactivated")
            val users = it.userRepository.getAll(offset, limit, query, deactivated)
            return@run if (users.isEmpty()) {
                failure(UserError.NoUserFound)
            } else {
                success(users)
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

    fun deactivate(
        author: User,
        id: Int,
    ): UserUpdateResult =
        transactionManager.run {
            if (!author.active) {
                return@run failure(UserError.DeactivatedAccount)
            }
            logger.info("Deactivating user by id: $id; author: ${author.username}")
            if (author.role == UserRole.ADMIN && author.id != id) {
                val result = it.userRepository.deactivate(id, clock.now())
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
        val username =
            if (username.isUsernameValid()) {
                Username(username)
            } else {
                return failure(LoginError.InvalidCredentials)
            }

        if (!password.isPasswordValid()) {
            return failure(LoginError.InvalidCredentials)
        }

        return transactionManager.run {
            val user =
                it.userRepository.getByUsername(username)
                    ?: return@run failure(LoginError.InvalidCredentials)
            if (!user.active) {
                return@run failure(LoginError.DeactivatedAccount)
            }
            if (!verifyPasswordMatch(password, user.passwordHash)) {
                return@run failure(LoginError.InvalidCredentials)
            }
            val tokenValue = generateTokenValue()
            val now = clock.now()
            val newSession =
                Session(
                    tokenEncoder.createSessionToken(tokenValue),
                    user.id,
                    now,
                    now,
                )

            it.userRepository.createSession(newSession, config.maxTokensPerUser)
            success(LoginResultOutput(tokenValue, getTokenExpiration(newSession)))
        }
    }

    fun verifyPasswordMatch(
        loginPassword: String,
        realPasswordInfo: PasswordHash,
    ): Boolean = passwordEncoder.matches(loginPassword, realPasswordInfo.value)

    fun logout(tokenValue: String): Boolean {
        val sessionToken = tokenEncoder.createSessionToken(tokenValue)
        return transactionManager.run {
            it.userRepository.deleteSession(sessionToken)
            true
        }
    }

    fun getUserByToken(token: String): User? {
        if (!canBeToken(token)) {
            return null
        }
        return transactionManager.run {
            val sessionToken = tokenEncoder.createSessionToken(token)
            val userAndToken = it.userRepository.getUserAndSessionByToken(sessionToken)
            if (userAndToken != null && userAndToken.second.isStillValid(clock)) {
                it.userRepository.updateSessionTokenUsage(userAndToken.second, clock.now())
                userAndToken.first
            } else {
                null
            }
        }
    }

    private fun generateTokenValue(): String =
        ByteArray(config.tokenSizeInBytes).let { byteArray ->
            SecureRandom.getInstanceStrong().nextBytes(byteArray)
            getUrlEncoder().encodeToString(byteArray)
        }

    private fun getTokenExpiration(session: Session): Instant {
        val expirationTime = session.createdAt + config.tokenExpirationTime
        val sessionExpiration = session.lastUsedAt + config.sessionExpirationTime
        logger.info("Expiration time: $expirationTime; sessionExpiration: $sessionExpiration; Session: ${session.sessionToken}")
        return if (expirationTime < sessionExpiration) {
            expirationTime
        } else {
            sessionExpiration
        }
    }

    private fun canBeToken(token: String): Boolean =
        try {
            getUrlDecoder().decode(token).size == config.tokenSizeInBytes
        } catch (e: IllegalArgumentException) {
            false
        }

    private fun Session.isStillValid(clock: Clock): Boolean {
        val now = clock.now()
        return this.createdAt <= now &&
            (now - this.createdAt) <= config.tokenExpirationTime &&
            (now - this.lastUsedAt) <= config.sessionExpirationTime
    }
}
