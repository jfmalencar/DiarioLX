package pt.ipl.diariolx.utils.token

/**
 * Strongly typed information of token hashed by a TokenEncoder.
 */
data class SessionToken(
    val value: String,
) {
    override fun equals(other: Any?): Boolean = other is SessionToken && value == other.value
}
