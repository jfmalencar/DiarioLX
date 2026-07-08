package pt.ipl.diariolx.domain.content

object Embed {
    private val YOUTUBE = Regex("""https?://(www\.)?(youtube\.com|youtu\.be)/""", RegexOption.IGNORE_CASE)
    private val SPOTIFY = Regex("""https?://(open\.)?spotify\.com/""", RegexOption.IGNORE_CASE)

    fun isYoutube(url: String): Boolean = YOUTUBE.containsMatchIn(url.trim())

    fun isSpotify(url: String): Boolean = SPOTIFY.containsMatchIn(url.trim())
}
