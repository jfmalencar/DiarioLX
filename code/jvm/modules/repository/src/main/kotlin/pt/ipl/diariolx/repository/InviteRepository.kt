package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.internal.NewInvite

interface InviteRepository {
    fun get(invite: String): Invite?

    fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        expired: Boolean?,
    ): List<Invite>

    fun create(invite: NewInvite): Invite

    fun consumeInvite(id: Int): Boolean
}
