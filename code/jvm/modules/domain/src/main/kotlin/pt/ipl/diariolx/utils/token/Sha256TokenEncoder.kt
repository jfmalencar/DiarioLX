package pt.ipl.diariolx.utils.token

import pt.ipl.diariolx.domain.auth.RefreshToken
import java.security.MessageDigest
import java.util.Base64

class Sha256TokenEncoder : TokenEncoder {
    companion object {
        val messageDigest = MessageDigest.getInstance("SHA-256")
    }

    override fun createSessionToken(token: String): RefreshToken = RefreshToken(hash(token))

    private fun hash(input: String): String =
        Base64.getUrlEncoder().encodeToString(
            messageDigest.digest(
                Charsets.UTF_8.encode(input).array(),
            ),
        )
}
