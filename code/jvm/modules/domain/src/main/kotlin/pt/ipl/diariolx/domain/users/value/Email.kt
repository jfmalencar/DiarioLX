package pt.ipl.diariolx.domain.users.value

@JvmInline
value class Email(
    val value: String,
) {
    companion object {
        private val REGEX = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
        const val MIN_LENGTH = 5
        const val MAX_LENGTH = 45

        fun parse(value: String?): Email? = if (value != null && isValid(value)) Email(value) else null

        fun isValid(value: String): Boolean =
            value.isNotBlank() &&
                value.length in MIN_LENGTH..MAX_LENGTH &&
                REGEX.matches(value)
    }
}
