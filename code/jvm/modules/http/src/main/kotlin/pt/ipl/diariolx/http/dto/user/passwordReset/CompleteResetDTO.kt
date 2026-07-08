package pt.ipl.diariolx.http.dto.user.passwordReset

data class CompleteResetDTO(
    val resetToken: String?,
    val newPassword: String?,
)
