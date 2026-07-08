package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.passwordReset.NewResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.PasswordResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.ResetRequestStatus

interface PasswordResetRepository {
    fun create(
        newRequest: NewResetRequest,
        now: Instant,
    )

    fun delete(id: Int): Boolean

    fun getAll(
        status: ResetRequestStatus?,
        limit: Int,
        offset: Int,
    ): List<PasswordResetRequest>

    fun getById(id: Int): PasswordResetRequest?

    fun getByUserId(userId: Int): PasswordResetRequest?

    fun getByResetToken(resetToken: String): PasswordResetRequest?

    fun approve(
        id: Int,
        adminId: Int,
        resetToken: String,
        now: Instant,
    ): Boolean

    fun reject(
        id: Int,
        adminId: Int,
        now: Instant,
    )

    fun complete(
        id: Int,
        now: Instant,
    ): Boolean
}
