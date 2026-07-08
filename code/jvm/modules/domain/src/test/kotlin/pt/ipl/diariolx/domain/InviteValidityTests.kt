package pt.ipl.diariolx.domain

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.users.UserRole
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class InviteValidityTests {
    private val createdAt = Instant.fromEpochMilliseconds(1_000_000)
    private val expiresAt = Instant.fromEpochMilliseconds(2_000_000)

    private fun invite() =
        Invite(
            id = 1,
            invite = "CODE",
            role = UserRole.EDITOR,
            createdAt = createdAt,
            expiresAt = expiresAt,
            used = false,
        )

    @Test
    fun `an invite is valid within its lifetime, boundaries included`() {
        assertTrue(invite().isValidAt(createdAt))
        assertTrue(invite().isValidAt(Instant.fromEpochMilliseconds(1_500_000)))
        assertTrue(invite().isValidAt(expiresAt))
    }

    @Test
    fun `an invite is invalid before it exists or after it expires`() {
        assertFalse(invite().isValidAt(Instant.fromEpochMilliseconds(999_999)))
        assertFalse(invite().isValidAt(Instant.fromEpochMilliseconds(2_000_001)))
    }
}
