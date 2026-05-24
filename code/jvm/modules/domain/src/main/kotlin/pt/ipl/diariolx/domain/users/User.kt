package pt.ipl.diariolx.domain.users

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username

data class User(
    val id: Int,
    val username: Username,
    val email: Email,
    val passwordHash: PasswordHash,
    val role: UserRole,
    val fName: Name,
    val lName: Name,
    val bio: String = "",
    val createdAt: Instant,
    val updatedAt: Instant,
    val profilePictureURL: String = "",
    val active: Boolean = true,
)
