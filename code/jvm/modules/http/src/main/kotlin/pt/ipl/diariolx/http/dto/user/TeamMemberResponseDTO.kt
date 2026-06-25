package pt.ipl.diariolx.http.dto.user

import pt.ipl.diariolx.domain.users.User

data class TeamMemberResponseDTO(
    val id: Int,
    val name: String,
    val slug: String,
    val position: String,
    val bio: String,
    val photoPath: String?,
) {
    companion object {
        fun from(user: User) =
            TeamMemberResponseDTO(
                id = user.id,
                name = "${user.firstName.value} ${user.lastName.value}",
                slug = user.username.value,
                position = user.position,
                bio = user.bio,
                photoPath = user.avatar?.let { "${it.bucket}/${it.objectKey}" },
            )
    }
}
