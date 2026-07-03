package pt.ipl.diariolx.domain.auth

data class CookieConfig(
    // When true, session cookies carry the Secure attribute (HTTPS only).
    // Enabled in production; off by default so cookies work over plain HTTP in dev.
    val secure: Boolean = false,
)
