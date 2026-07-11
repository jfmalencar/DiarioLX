package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.passwordReset.NewResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.PasswordResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.ResetRequestStatus
import pt.ipl.diariolx.repository.PasswordResetRepository

class PasswordResetRepositoryMem : PasswordResetRepository {
    override fun create(
        newRequest: NewResetRequest,
        now: Instant,
    ) {
        TODO("Not yet implemented")
    }

    override fun delete(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    override fun getAll(
        status: ResetRequestStatus?,
        limit: Int,
        offset: Int,
    ): List<PasswordResetRequest> {
        TODO("Not yet implemented")
    }

    override fun getById(id: Int): PasswordResetRequest? {
        TODO("Not yet implemented")
    }

    override fun getByUserId(userId: Int): List<PasswordResetRequest> {
        TODO("Not yet implemented")
    }

    override fun getByResetToken(resetToken: String): PasswordResetRequest? {
        TODO("Not yet implemented")
    }

    override fun approve(
        id: Int,
        adminId: Int,
        resetToken: String,
        now: Instant,
    ): Boolean {
        TODO("Not yet implemented")
    }

    override fun reject(
        id: Int,
        adminId: Int,
        now: Instant,
    ) {
        TODO("Not yet implemented")
    }

    override fun complete(
        id: Int,
        now: Instant,
    ): Boolean {
        TODO("Not yet implemented")
    }

    /*
    val passwordRequests = mutableListOf<PasswordResetRequest>()
    var index = 0

    override fun create(
        newRequest: NewResetRequest,
        now: Instant,
    ) {
        passwordRequests.add(
            PasswordResetRequest(
                ++index,
                newRequest.userId,
                ResetRequestStatus.PENDING,
                null,
                null,
                now,
                now,
            ),
        )
    }

    override fun delete(id: Int): Boolean = passwordRequests.removeIf { it.id == id }

    override fun getAll(
        status: ResetRequestStatus?,
        limit: Int,
        offset: Int,
    ): List<PasswordResetRequest> {
        val result =
            status?.let {
                passwordRequests.filter { request -> request.status == status }
            } ?: passwordRequests
        return result.drop(offset).take(limit)
    }

    override fun getById(id: Int): PasswordResetRequest? =
        passwordRequests.firstOrNull {
            it.id == id
        }

    override fun getByResetToken(resetToken: String): PasswordResetRequest? =
        passwordRequests.firstOrNull {
            it.resetToken == resetToken
        }

    override fun approve(
        id: Int,
        adminId: Int,
        resetToken: String,
        now: Instant,
    ): Boolean {
        val request = getById(id) ?: return false
        passwordRequests.removeIf { it.id == request.id }
        passwordRequests.add(
            PasswordResetRequest(
                request.id,
                request.requesterId,
                ResetRequestStatus.APPROVED,
                adminId,
                resetToken,
                request.createdAt,
                now,
            ),
        )
        return true
    }

    override fun reject(
        id: Int,
        adminId: Int,
        now: Instant,
    ) {
        val request = getById(id) ?: return
        passwordRequests.removeIf { it.id == request.id }
        passwordRequests.add(
            PasswordResetRequest(
                request.id,
                request.requesterId,
                ResetRequestStatus.REJECTED,
                adminId,
                null,
                request.createdAt,
                now,
            ),
        )
    }

    override fun complete(
        id: Int,
        now: Instant,
    ): Boolean {
        val request = getById(id) ?: return false
        passwordRequests.removeIf { it.id == request.id }
        passwordRequests.add(
            PasswordResetRequest(
                request.id,
                request.requesterId,
                ResetRequestStatus.COMPLETED,
                request.adminId,
                null,
                request.createdAt,
                now,
            ),
        )
        return true
    }
     */
}
