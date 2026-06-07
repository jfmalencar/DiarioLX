package pt.ipl.diariolx.http.dto.user

import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole

data class UserResponseDTO(
    val userId: Int,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val bio: String?,
    val profilePicturePath: String?,
    val createdAt: String,
    val updatedAt: String,
    val isActive: Boolean,
    val role: UserRole,
    val features: List<String>,
) {
    companion object {
        fun from(user: User) =
            UserResponseDTO(
                user.id,
                user.username.value,
                user.email.value,
                user.firstName.value,
                user.lastName.value,
                user.bio,
                user.avatar?.let { "${it.bucket}/${it.objectKey}" },
                user.createdAt.toString(),
                user.updatedAt.toString(),
                user.active,
                user.role,
                user.role.features(),
            )
    }
}
