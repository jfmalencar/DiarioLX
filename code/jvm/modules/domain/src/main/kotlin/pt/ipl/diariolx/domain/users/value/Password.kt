package pt.ipl.diariolx.domain.users.value

@JvmInline
value class Password(
    val value: String,
) {
    companion object {
        // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        // Must contain uppercase, lowercase, number, special character, 8-25 chars
        private val REGEX = Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[._@$!%*?&-])[A-Za-z\\d._@$!%*?&-]{8,25}$")

        fun parse(value: String?): Password? = if (value != null && isValid(value)) Password(value) else null

        fun isValid(value: String): Boolean = REGEX.matches(value)
    }
}
