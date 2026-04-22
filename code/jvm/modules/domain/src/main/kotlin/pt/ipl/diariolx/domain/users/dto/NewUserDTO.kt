package pt.ipl.diariolx.domain.users.dto

data class NewUserDTO(
    val username: String,
    val email: String,
    val password: String,
    val fName: String,
    val lName: String,
)