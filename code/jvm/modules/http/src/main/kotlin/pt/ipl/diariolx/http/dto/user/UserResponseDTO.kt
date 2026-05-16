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
    val profilePictureURL: String?,
    val createdAt: String,
    val updatedAt: String,
    val isActive: Boolean,
    val role: UserRole,
) {
    companion object {
        fun from(user: User) =
            UserResponseDTO(
                user.id,
                user.username.value,
                user.email.value,
                user.fName.value,
                user.lName.value,
                user.bio,
                user.profilePictureURL,
                user.createdAt.toString(),
                user.updatedAt.toString(),
                user.active,
                user.role,
            )
    }
}
