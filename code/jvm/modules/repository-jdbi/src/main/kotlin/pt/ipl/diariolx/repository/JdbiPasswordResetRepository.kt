package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.users.passwordReset.NewResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.PasswordResetRequest
import pt.ipl.diariolx.domain.users.passwordReset.ResetRequestStatus
import pt.ipl.diariolx.domain.users.value.Email
import pt.ipl.diariolx.domain.users.value.Username

class JdbiPasswordResetRepository(
    private val handle: Handle,
) : PasswordResetRepository {
    override fun create(
        newRequest: NewResetRequest,
        now: Instant,
    ) {
        handle
            .createUpdate(
                """
                INSERT INTO password_reset_requests (user_id, status, created_at, updated_at)
                VALUES (:user_id, :status::reset_request_status, :created_at, :updated_at)
                """,
            ).bind("user_id", newRequest.userId)
            .bind("status", ResetRequestStatus.PENDING.name)
            .bind("created_at", now.epochSeconds)
            .bind("updated_at", now.epochSeconds)
            .execute()
    }

    override fun delete(id: Int): Boolean {
        val rowsAffected =
            handle
                .createUpdate("DELETE FROM password_reset_requests WHERE id = :id")
                .bind("id", id)
                .execute()
        return rowsAffected > 0
    }

    override fun getAll(
        status: ResetRequestStatus?,
        limit: Int,
        offset: Int,
    ): List<PasswordResetRequest> {
        val sql =
            buildString {
                append("SELECT * FROM v_password_reset_requests")
                if (status != null) {
                    append(" WHERE status = :status::reset_request_status")
                }
                append(" ORDER BY id DESC LIMIT :limit OFFSET :offset")
            }

        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", offset)
            .let { query ->
                if (status != null) query.bind("status", status.name) else query
            }.mapTo<ResetRequestDBModel>()
            .list()
            .map { it.toDomain() }
    }

    override fun getById(id: Int): PasswordResetRequest? =
        handle
            .createQuery("SELECT * FROM v_password_reset_requests WHERE id = :id")
            .bind("id", id)
            .mapTo<ResetRequestDBModel>()
            .singleOrNull()
            ?.toDomain()

    override fun getByUserId(userId: Int): PasswordResetRequest? =
        handle
            .createQuery("SELECT * FROM v_password_reset_requests WHERE user_id = :user_id")
            .bind("user_id", userId)
            .mapTo<ResetRequestDBModel>()
            .singleOrNull()
            ?.toDomain()

    override fun getByResetToken(resetToken: String): PasswordResetRequest? =
        handle
            .createQuery(
                """
                SELECT * FROM v_password_reset_requests 
                WHERE reset_token = :reset_token 
                  AND status = 'APPROVED'::reset_request_status
                """,
            ).bind("reset_token", resetToken)
            .mapTo<ResetRequestDBModel>()
            .singleOrNull()
            ?.toDomain()

    override fun approve(
        id: Int,
        adminId: Int,
        resetToken: String,
        now: Instant,
    ): Boolean {
        val rowsAffected =
            handle
                .createUpdate(
                    """
                UPDATE password_reset_requests
                SET status = 'APPROVED'::reset_request_status,
                    admin_id = :admin_id,
                    reset_token = :reset_token,
                    updated_at = :updated_at
                WHERE id = :id AND status = 'PENDING'::reset_request_status
                """,
                ).bind("id", id)
                .bind("admin_id", adminId)
                .bind("reset_token", resetToken)
                .bind("updated_at", now.epochSeconds)
                .execute()

        return rowsAffected > 0
    }

    override fun reject(
        id: Int,
        adminId: Int,
        now: Instant,
    ) {
        handle
            .createUpdate(
                """
                UPDATE password_reset_requests
                SET status = 'REJECTED'::reset_request_status,
                    admin_id = :admin_id,
                    updated_at = :updated_at
                WHERE id = :id AND status = 'PENDING'::reset_request_status
                """,
            ).bind("id", id)
            .bind("admin_id", adminId)
            .bind("updated_at", now.epochSeconds)
            .execute()
    }

    override fun complete(
        id: Int,
        now: Instant,
    ): Boolean {
        val rowsAffected =
            handle
                .createUpdate(
                    """
                UPDATE password_reset_requests
                SET status = 'COMPLETED'::reset_request_status,
                    updated_at = :updated_at
                WHERE id = :id AND status = 'APPROVED'::reset_request_status
                """,
                ).bind("id", id)
                .bind("updated_at", now.epochSeconds)
                .execute()

        return rowsAffected > 0
    }

    private data class ResetRequestDBModel(
        val id: Int,
        val userId: Int,
        val status: String,
        val rUsername: String,
        val rEmail: String,
        val rName: String,
        val adminId: Int?,
        val adminUsername: String?,
        val adminName: String?,
        val resetToken: String?,
        val createdAt: Long,
        val updatedAt: Long,
    ) {
        fun toDomain(): PasswordResetRequest =
            PasswordResetRequest(
                id = id,
                requesterId = userId,
                status = ResetRequestStatus.valueOf(status),
                requesterUsername = Username(rUsername),
                requesterEmail = Email(rEmail),
                requesterName = rName,
                adminId = adminId,
                adminUsername = adminUsername?.let { Username(it) },
                adminName = adminName,
                resetToken = resetToken,
                createdAt = Instant.fromEpochSeconds(createdAt),
                updatedAt = Instant.fromEpochSeconds(updatedAt),
            )
    }
}
