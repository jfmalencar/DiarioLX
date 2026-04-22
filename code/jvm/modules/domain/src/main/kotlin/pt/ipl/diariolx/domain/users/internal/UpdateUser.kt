package pt.ipl.diariolx.domain.users.internal

import pt.ipl.diariolx.utils.user.Email
import pt.ipl.diariolx.utils.user.Name
import pt.ipl.diariolx.utils.user.PasswordHash
import pt.ipl.diariolx.utils.user.Username

data class UpdateUser(
    val username: Username,
    val email: Email,
    val password: PasswordHash,
    val fName: Name,
    val lName: Name,
    val bio: String = "",
    val profilePictureURL: String = "",
)