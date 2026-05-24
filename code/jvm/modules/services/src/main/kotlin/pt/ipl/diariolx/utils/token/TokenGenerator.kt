package pt.ipl.diariolx.utils.token

import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.users.UserRole

interface TokenGenerator {
    fun generateAccessToken(
        userId: Int,
        role: UserRole,
    ): String

    fun generateRefreshToken(): RefreshToken
}
