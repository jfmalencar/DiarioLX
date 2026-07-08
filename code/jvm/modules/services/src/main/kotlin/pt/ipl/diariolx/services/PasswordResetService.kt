package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
import org.slf4j.Logger
import org.springframework.security.crypto.password.PasswordEncoder
import pt.ipl.diariolx.domain.users.internal.UpdateUser
import pt.ipl.diariolx.domain.users.passwordReset.NewResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.ResetRequestStatus
import pt.ipl.diariolx.domain.users.value.Password
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.ApproveRequestResult
import pt.ipl.diariolx.utils.CreateResetRequestResult
import pt.ipl.diariolx.utils.DeleteResetRequestResult
import pt.ipl.diariolx.utils.GetAllRequestsResult
import pt.ipl.diariolx.utils.ResetRequestResult
import pt.ipl.diariolx.utils.UserError
import pt.ipl.diariolx.utils.UserUpdateResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success
import java.security.SecureRandom

@Named
class PasswordResetService(
    private val transactionManager: TransactionManager,
    private val passwordEncoder: PasswordEncoder,
    private val clock: Clock.System,
    private val logger: Logger,
    private val secureRandom: SecureRandom,
) {
    fun create(username: String?): CreateResetRequestResult {
        val username = Username.parse(username) ?: return failure(UserError.InvalidUsername)
        return transactionManager.run { tx ->
            val user = tx.userRepository.getByUsername(username) ?: return@run failure(UserError.UserNotFound)
            val request = tx.passwordResetRepository.getByUserId(user.id)
            request?.let {
                tx.passwordResetRepository.delete(it.id)
            }
            val newResetRequest = NewResetRequest(user.id)
            tx.passwordResetRepository.create(newResetRequest, clock.now())
            return@run success(Unit)
        }
    }

    fun delete(requestId: Int?): DeleteResetRequestResult =
        transactionManager.run { tx ->
            val result =
                requestId?.let {
                    tx.passwordResetRepository.delete(it)
                }
            return@run if (result == true) success(Unit) else failure(UserError.ResetRequestNotFound)
        }

    fun get(id: Int): ResetRequestResult =
        transactionManager.run {
            val request = it.passwordResetRepository.getById(id)
            if (request == null) {
                return@run failure(UserError.ResetRequestNotFound)
            } else {
                return@run success(request)
            }
        }

    fun getAll(
        page: Int,
        size: Int,
        status: String?,
    ): GetAllRequestsResult {
        logger.info("GetAll Status: $status")
        val status =
            status?.let {
                try {
                    ResetRequestStatus.valueOf(it.uppercase())
                } catch (e: Exception) {
                    return failure(UserError.InvalidResetRequestStatus)
                }
            }
        return transactionManager.run {
            success(
                paginate(page, size) { limit, offset ->
                    it.passwordResetRepository.getAll(status, limit, offset)
                },
            )
        }
    }

    fun approve(
        requestId: Int,
        adminId: Int,
    ): ApproveRequestResult {
        val resetToken = generateSecureResetToken()
        return transactionManager.run { tx ->
            val request = tx.passwordResetRepository.getById(requestId) ?: return@run failure(UserError.ResetRequestNotFound)
            if (request.status != ResetRequestStatus.PENDING) return@run failure(UserError.InvalidResetRequestStatus)
            val result = tx.passwordResetRepository.approve(requestId, adminId, resetToken, clock.now())
            if (result) {
                return@run success(resetToken)
            } else {
                return@run failure(UserError.FailedApproval)
            }
        }
    }

    fun reject(
        requestId: Int,
        adminId: Int,
    ): ResetRequestResult {
        return transactionManager.run { tx ->
            val request = tx.passwordResetRepository.getById(requestId) ?: return@run failure(UserError.ResetRequestNotFound)
            if (request.status != ResetRequestStatus.PENDING) return@run failure(UserError.InvalidResetRequestStatus)
            tx.passwordResetRepository.reject(requestId, adminId, clock.now())
            success(request)
        }
    }

    fun complete(
        resetToken: String?,
        password: String?,
    ): UserUpdateResult {
        return transactionManager.run { tx ->
            val request =
                resetToken?.let {
                    tx.passwordResetRepository.getByResetToken(resetToken) ?: return@run failure(UserError.ResetRequestNotFound)
                } ?: return@run failure(UserError.InvalidResetToken)
            if (request.status != ResetRequestStatus.APPROVED) return@run failure(UserError.InvalidResetToken)
            val user =
                tx.userRepository.getById(request.requesterId)
                    ?: return@run failure(UserError.InvalidResetToken)
            val passwordHash =
                password?.let {
                    val pw = Password.parse(password) ?: return@run failure(UserError.InvalidPassword)
                    PasswordHash(passwordEncoder.encode(pw.value))
                } ?: return@run failure(UserError.InvalidPassword)
            val updatedUser =
                UpdateUser(
                    username = user.username,
                    email = user.email,
                    password = passwordHash,
                    fName = user.firstName,
                    lName = user.lastName,
                    position = user.position,
                    bio = user.bio,
                    onTeam = user.onTeam,
                )
            tx.userRepository.update(updatedUser, user.id, clock.now())
            tx.passwordResetRepository.complete(request.id, clock.now())
            success(Unit)
        }
    }

    private fun generateSecureResetToken(): String {
        val bytes = ByteArray(32)
        secureRandom.nextBytes(bytes)
        return bytes.joinToString("") { "%02x".format(it) }.uppercase()
    }
}
