package pt.ipl.diariolx.domain.users

import kotlinx.datetime.Instant
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Name
import pt.ipl.diariolx.utils.user.PasswordHash
import pt.ipl.diariolx.utils.user.Username

data class User(
    val id: Int,
    val username: Username,
    val email: Email,
    val passwordHash: PasswordHash,
    val role: UserRole,
    val fName: Name,
    val lName: Name,
    val bio: String = "", // TODO(): Prevent SQL Injection on Bio DB Field
    val createdAt: Instant,
    val updatedAt: Instant,
    val profilePictureURL: String = "",
    val active: Boolean = true,
)