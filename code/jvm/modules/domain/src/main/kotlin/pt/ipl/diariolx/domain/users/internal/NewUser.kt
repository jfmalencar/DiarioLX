package pt.ipl.diariolx.domain.users.internal

import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username

data class NewUser(
    val username: Username,
    val email: Email,
    val passwordHash: PasswordHash,
    val fName: Name,
    val lName: Name,
    val role: UserRole,
)
