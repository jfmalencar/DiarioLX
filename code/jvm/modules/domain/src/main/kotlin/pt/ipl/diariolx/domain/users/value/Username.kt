package pt.ipl.diariolx.domain.users.value

@JvmInline
value class Username(
    val value: String,
) {
    companion object {
        private val REGEX = Regex("^[a-zA-Z0-9_.-]+$")
        const val MIN_LENGTH = 3
        const val MAX_LENGTH = 30

        fun parse(value: String?): Username? = if (value != null && isValid(value)) Username(value) else null

        fun isValid(value: String): Boolean =
            value.isNotBlank() &&
                value.length in MIN_LENGTH..MAX_LENGTH &&
                REGEX.matches(value)
    }
}
