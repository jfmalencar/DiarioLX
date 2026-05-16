package pt.ipl.diariolx.http.dto.user

data class CreateUserRequestDTO(
    val username: String,
    val email: String,
    val password: String,
    val fName: String,
    val lName: String,
)
