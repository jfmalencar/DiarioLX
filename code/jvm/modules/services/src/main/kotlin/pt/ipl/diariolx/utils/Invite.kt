package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.invites.Invite

sealed class InviteError(
    val message: String,
) {
    object InvalidRole : InviteError("Invalid role")

    object Unauthorized : InviteError("User is unauthorized")

    object ActionError : InviteError("Action error")
}

typealias InviteCreateResult = Either<InviteError, Invite>

typealias InviteActionResult = Either<InviteError, Unit>
