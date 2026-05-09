package pt.ipl.diariolx.http.model

data class UpdateUserDTO(
    val username: String?,
    val email: String?,
    val password: String?,
    val fName: String?,
    val lName: String?,
    val bio: String?,
    val profilePictureURL: String?,
)
