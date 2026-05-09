package pt.ipl.diariolx.http.model

data class NewUserDTO(
    val username: String,
    val email: String,
    val password: String,
    val fName: String,
    val lName: String,
)
