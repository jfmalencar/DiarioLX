package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import org.slf4j.Logger
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.internal.NewInvite
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.repository.mappers.InstantMapper
import java.sql.ResultSet

class JdbiInviteRepository(
    private val handle: Handle,
    private val logger: Logger
) : InviteRepository {

    override fun get(invite: String): Invite? {
        logger.info("Looking for invite: $invite")

        // First check if invite exists at all
        val result = handle.createQuery(
            "SELECT id, invite_token, role_assigned, created_at, expires_at, used FROM invites WHERE invite_token = :invite_token"
        ).bind("invite_token", invite)
        .mapTo<InviteDBModel>()
        .singleOrNull()

        if (result == null) {
            logger.warn("Invite not found in database: $invite")
            return null
        }

        logger.info("Found invite in DB: used=${result.used}, expires_at=${result.expiresAt}, now=${System.currentTimeMillis() / 1000}")

        // Check if already used
        if (result.used) {
            logger.warn("Invite already used: $invite")
            return null
        }

        // Check if expired
        val now = System.currentTimeMillis() / 1000
        if (now > result.expiresAt) {
            logger.warn("Invite expired: $invite (expired at ${result.expiresAt}, now is $now)")
            return null
        }

        logger.info("Invite valid and ready to use: $invite")
        return result.toInviteDomain()
    }

    override fun create(invite: NewInvite): Invite {
        val id = handle.createUpdate(
            """
            INSERT INTO invites (invite_token, role_assigned, created_at, expires_at, used)
            VALUES (:invite_token, :role_assigned::user_role, :created_at, :expires_at, false)
            RETURNING id
            """
        ).bind("invite_token", invite.invite)
        .bind("role_assigned", invite.role.name)
        .bind("created_at", invite.createdAt.epochSeconds)
        .bind("expires_at", invite.expiresAt.epochSeconds)
        .executeAndReturnGeneratedKeys()
        .mapTo(Int::class.java)
        .one()

        return Invite(
            id = id,
            invite = invite.invite,
            role = invite.role,
            createdAt = invite.createdAt,
            expiresAt = invite.expiresAt,
            used = false,
        )
    }

    override fun consumeInvite(id: Int): Boolean {
        val rowsAffected = handle.createUpdate(
            "UPDATE invites SET used = true WHERE id = :id AND used = false"
        ).bind("id", id)
        .execute()
        return rowsAffected > 0
    }

    private data class InviteDBModel(
        val id: Int,
        val inviteToken: String,
        val roleAssigned: String,
        val createdAt: Long,
        val expiresAt: Long,
        val used: Boolean,
    ) {
        fun toInviteDomain(): Invite =
            Invite(
                id = id,
                invite = inviteToken,
                role = UserRole.valueOf(roleAssigned),
                createdAt = Instant.fromEpochSeconds(createdAt),
                expiresAt = Instant.fromEpochSeconds(expiresAt),
                used = used,
            )
    }
}

