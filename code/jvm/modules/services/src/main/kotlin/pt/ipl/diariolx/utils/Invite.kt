package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.invites.Invite

sealed class InviteError(
    val message: String,
) {
    object InvalidRole : InviteError("Invalid role")

    object Unauthorized : InviteError("User is unauthorized")
}

typealias InviteCreateResult = Either<InviteError, Invite>
