package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.config.InviteDomainConfig
import pt.ipl.diariolx.domain.invites.internal.NewInvite
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.Either
import pt.ipl.diariolx.utils.UserError
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.success
import java.util.UUID

@Named
class InviteServices(
    private val transactionManager: TransactionManager,
    val config: InviteDomainConfig,
    private val clock: Clock.System,
) {
    fun getInvite(invite: String): Invite? =
        transactionManager.run {
            val result = it.inviteRepository.get(invite) ?: return@run null
            if (result.isStillValid(clock)){
                result
            } else {
                null
            }
        }

    fun createInvite(author: User, role: String): Either<UserError, Invite> {
        if (author.role != UserRole.ADMIN) {
            return failure(UserError.Unauthorized)
        }
        val userRole = try {
            UserRole.valueOf(role.uppercase())
        } catch (e: IllegalArgumentException) {
            return failure(UserError.InvalidRole)
        }
        return transactionManager.run {
            val inviteCode = generateInviteCode()
            val now = clock.now()
            val invite =
                NewInvite(
                    invite = inviteCode,
                    createdAt = now,
                    expiresAt = now.plus(config.inviteExpirationTime),
                    role = userRole
                )
            val result = it.inviteRepository.create(invite)
            success(result)
        }
    }

    private fun generateInviteCode(): String =
        UUID.randomUUID().toString()

    private fun Invite.isStillValid(clock: Clock): Boolean {
        val now = clock.now()
        return this.createdAt <= now
                && (now - this.createdAt) <= config.inviteExpirationTime
    }
}

