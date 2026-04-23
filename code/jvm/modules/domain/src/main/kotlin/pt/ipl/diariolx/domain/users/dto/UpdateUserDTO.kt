package pt.ipl.diariolx.domain.users.dto

data class UpdateUserDTO(
    val username: String?,
    val email: String?,
    val password: String?,
    val fName: String?,
    val lName: String?,
    val bio: String?,
    val profilePictureURL: String?,
)
