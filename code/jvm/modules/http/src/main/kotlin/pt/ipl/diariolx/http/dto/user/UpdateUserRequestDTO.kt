package pt.ipl.diariolx.http.dto.user

data class UpdateUserRequestDTO(
    val username: String?,
    val email: String?,
    val password: String?,
    val fName: String?,
    val lName: String?,
    val bio: String?,
    val profilePictureURL: String?,
)
