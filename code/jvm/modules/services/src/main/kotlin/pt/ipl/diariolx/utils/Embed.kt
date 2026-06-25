package pt.ipl.diariolx.utils

// Lightweight validation for external embed URLs. The frontend normalises these
// to iframe sources; here we only check the URL belongs to the expected provider.
object Embed {
    private val YOUTUBE = Regex("""https?://(www\.)?(youtube\.com|youtu\.be)/""", RegexOption.IGNORE_CASE)
    private val SPOTIFY = Regex("""https?://(open\.)?spotify\.com/""", RegexOption.IGNORE_CASE)

    fun isYoutube(url: String): Boolean = YOUTUBE.containsMatchIn(url.trim())

    fun isSpotify(url: String): Boolean = SPOTIFY.containsMatchIn(url.trim())
}
