package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.internal.NewInvite
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.repository.InviteRepository
import kotlin.time.Duration.Companion.minutes

class InviteRepositoryMem : InviteRepository {
    private val invites = mutableListOf<Invite>(
        Invite(
            1,
            "SUPER-ADMIN-INVITE",
            UserRole.ADMIN,
            Clock.System.now(),
            Instant.fromEpochSeconds(25.minutes.inWholeSeconds),
            false,
        )
    )
    private var currentId = 2
    override fun get(invite: String): Invite? {
        return invites.find { it.invite == invite }
    }

    override fun create(invite: NewInvite): Invite {
        val newInvite = Invite(
            id = currentId++,
            invite = invite.invite,
            role = invite.role,
            createdAt = invite.createdAt,
            expiresAt = invite.expiresAt,
            used = false
        )
        invites.add(newInvite)
        return newInvite
    }

    override fun consumeInvite(id: Int): Boolean {
        val invite = invites.find { it.id == id } ?: return false
        check(!invite.used) { "An used invite should never exist." }
        invites.remove(invite)
        return true
    }
}
