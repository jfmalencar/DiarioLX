package pt.ipl.diariolx.domain.users.internal

import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Name
import pt.ipl.diariolx.domain.users.value.PasswordHash
import pt.ipl.diariolx.domain.users.value.Username

data class UpdateUser(
    val username: Username,
    val email: Email,
    val password: PasswordHash,
    val fName: Name,
    val lName: Name,
    val bio: String = "",
)
