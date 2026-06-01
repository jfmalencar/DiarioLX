package pt.ipl.diariolx.http.dto.user

data class UpdateUserRequestDTO(
    val username: String?,
    val email: String?,
    val password: String?,
    val firstName: String?,
    val lastName: String?,
    val bio: String?,
)
