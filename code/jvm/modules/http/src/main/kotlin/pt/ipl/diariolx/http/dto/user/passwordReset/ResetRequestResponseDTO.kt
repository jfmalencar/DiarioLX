package pt.ipl.diariolx.http.dto.user.passwordReset

import pt.ipl.diariolx.domain.users.passwordReset.PasswordResetRequest

data class ResetRequestResponseDTO(
    val id: Int,
    val requesterId: Int,
    val status: String,
    val requesterUsername: String,
    val requesterEmail: String,
    val requesterName: String,
    val adminId: Int?,
    val adminUsername: String?,
    val adminName: String?,
    val resetToken: String?,
    val createdAt: String,
    val updatedAt: String,
) {
    companion object {
        fun from(request: PasswordResetRequest): ResetRequestResponseDTO =
            ResetRequestResponseDTO(
                id = request.id,
                requesterId = request.requesterId,
                status = request.status.name,
                requesterUsername = request.requesterUsername.value,
                requesterEmail = request.requesterEmail.value,
                requesterName = request.requesterName,
                adminId = request.adminId,
                adminUsername = request.adminUsername?.value,
                adminName = request.adminName,
                resetToken = request.resetToken,
                createdAt = request.createdAt.toString(),
                updatedAt = request.updatedAt.toString(),
            )
    }
}
