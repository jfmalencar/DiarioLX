package pt.ipl.diariolx.domain.users.internal

import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Name
import pt.ipl.diariolx.utils.user.PasswordHash
import pt.ipl.diariolx.utils.user.Username

data class NewUser(
    val username: Username,
    val email: Email,
    val passwordHash: PasswordHash,
    val fName: Name,
    val lName: Name,
    val role: UserRole
)