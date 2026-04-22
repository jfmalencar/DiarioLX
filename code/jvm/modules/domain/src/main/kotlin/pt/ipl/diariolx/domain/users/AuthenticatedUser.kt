package pt.ipl.diariolx.domain.users

data class AuthenticatedUser(
    val user: User,
    val token: String
)
