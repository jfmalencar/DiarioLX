package pt.ipl.diariolx.utils.token

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Encoders
import io.jsonwebtoken.security.Keys
import kotlinx.datetime.Instant
import org.springframework.stereotype.Component
import pt.ipl.diariolx.domain.auth.JwtConfig
import pt.ipl.diariolx.domain.auth.JwtTokenInfo
import pt.ipl.diariolx.domain.auth.RefreshToken
import pt.ipl.diariolx.domain.users.UserRole
import java.security.SecureRandom
import java.util.Base64
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenGenerator(
    private val jwtConfig: JwtConfig,
) : TokenGenerator {
    private val secureRandom = SecureRandom()

    private val signingKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(
            Base64
                .getDecoder()
                .decode(jwtConfig.secret),
        )
    }

    override fun generateAccessToken(
        userId: Int,
        role: UserRole,
    ): String =
        Jwts
            .builder()
            .subject(userId.toString())
            .claim(ROLE_CLAIM, role.name)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + jwtConfig.accessTokenExpirationMs))
            .signWith(signingKey)
            .compact()

    override fun generateRefreshToken(): RefreshToken =
        RefreshToken(
            ByteArray(32)
                .also { secureRandom.nextBytes(it) }
                .let { Encoders.BASE64URL.encode(it) },
        )

    fun validateAccessToken(token: String): JwtTokenInfo? =
        try {
            val claims =
                Jwts
                    .parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .payload

            JwtTokenInfo(
                userId = claims.subject.toInt(),
                role = UserRole.valueOf(claims.get(ROLE_CLAIM, String::class.java)),
                issuedAt = claims.issuedAt.toInstant().let { Instant.fromEpochMilliseconds(it.toEpochMilli()) },
                expiration = claims.expiration.toInstant().let { Instant.fromEpochMilliseconds(it.toEpochMilli()) },
            )
        } catch (e: JwtException) {
            null
        } catch (e: IllegalArgumentException) {
            null
        }

    companion object {
        private const val ROLE_CLAIM = "role"
    }
}
