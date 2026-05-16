package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.config.InviteDomainConfig
import pt.ipl.diariolx.domain.invites.internal.NewInvite
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.InviteCreateResult
import pt.ipl.diariolx.utils.InviteError
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success

@Named
class InviteService(
    private val transactionManager: TransactionManager,
    val config: InviteDomainConfig,
    private val clock: Clock.System,
) {
    fun getInvite(invite: String): Invite? =
        transactionManager.run {
            val result = it.inviteRepository.get(invite) ?: return@run null
            if (result.isStillValid(clock)) {
                result
            } else {
                null
            }
        }

    fun getAllInvites(
        page: Int,
        size: Int,
        query: String?,
        expired: Boolean?,
    ): PageResponse<Invite> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.inviteRepository.getAll(limit, offset, query, expired)
            }
        }

    fun createInvite(
        author: User,
        role: String,
    ): InviteCreateResult {
        if (author.role != UserRole.ADMIN) {
            return failure(InviteError.Unauthorized)
        }
        val userRole =
            try {
                UserRole.valueOf(role.uppercase())
            } catch (e: IllegalArgumentException) {
                return failure(InviteError.InvalidRole)
            }
        return transactionManager.run {
            val inviteCode = generateInviteCode()
            val now = clock.now()
            val invite =
                NewInvite(
                    invite = inviteCode,
                    createdAt = now,
                    expiresAt = now.plus(config.inviteExpirationTime),
                    role = userRole,
                )
            val result = it.inviteRepository.create(invite)
            success(result)
        }
    }

    // private fun generateInviteCode(): String = UUID.randomUUID().toString()

    private val alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

    private fun generateInviteCode(length: Int = 8): String =
        buildString(length) {
            repeat(length) {
                append(
                    alphabet.random(),
                )
            }
        }

    private fun Invite.isStillValid(clock: Clock): Boolean {
        val now = clock.now()
        return this.createdAt <= now &&
            (now - this.createdAt) <= config.inviteExpirationTime
    }
}
