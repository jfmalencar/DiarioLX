package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import org.slf4j.Logger
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.internal.NewInvite
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.repository.JdbiTagRepository.TagModel

class JdbiInviteRepository(
    private val handle: Handle,
    private val logger: Logger,
) : InviteRepository {
    override fun get(invite: String): Invite? {
        logger.info("Looking for invite: $invite")

        return handle
            .createQuery(
                """
                        SELECT id, invite_token, role_assigned, created_at, expires_at, used
                        FROM invites
                        WHERE invite_token = :invite_token
                        AND used = false
                        AND expires_at > EXTRACT(EPOCH FROM NOW())
                        """,
            ).bind("invite_token", invite)
            .mapTo<InviteDBModel>()
            .singleOrNull()
            ?.also { logger.info("Found invite: $it") }
            ?.toInviteDomain()
    }

    override fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        expired: Boolean?,
    ): List<Invite> {
        val sql =
            buildString {
                append("select id, invite_token, role_assigned, created_at, expires_at, used from invites WHERE 1 = 1".trimIndent())
                if (expired == false) {
                    append(" AND expires_at > EXTRACT(EPOCH FROM NOW())")
                }
                if (expired == true) {
                    append(" AND expires_at <= EXTRACT(EPOCH FROM NOW())")
                }
                if (query != null) {
                    append(" AND (name ILIKE :query OR slug ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }
        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", (page - 1) * limit)
            .bind("query", "%$query%")
            .mapTo<InviteDBModel>()
            .list()
            .map { it.toInviteDomain() }
    }

    override fun create(invite: NewInvite): Invite {
        val id =
            handle
                .createUpdate(
                    """
            INSERT INTO invites (invite_token, role_assigned, created_at, expires_at, used)
            VALUES (:invite_token, :role_assigned::user_role, :created_at, :expires_at, false)
            RETURNING id
            """,
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
        val rowsAffected =
            handle
                .createUpdate(
                    "DELETE FROM invites WHERE id = :id",
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
