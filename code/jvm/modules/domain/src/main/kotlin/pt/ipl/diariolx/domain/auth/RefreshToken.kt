package pt.ipl.diariolx.domain.auth

data class RefreshToken(
    val value: String,
) {
    override fun equals(other: Any?): Boolean = other is RefreshToken && value == other.value

    override fun hashCode(): Int = value.hashCode()
}
