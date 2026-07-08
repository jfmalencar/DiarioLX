package pt.ipl.diariolx.domain.users.passwordReset

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Username

data class PasswordResetRequest(
    val id: Int,
    val requesterId: Int,
    val status: ResetRequestStatus,
    val requesterUsername: Username,
    val requesterEmail: Email,
    val requesterName: String,
    val adminId: Int?,
    val adminUsername: Username?,
    val adminName: String?,
    val resetToken: String?,
    val createdAt: Instant,
    val updatedAt: Instant,
)
