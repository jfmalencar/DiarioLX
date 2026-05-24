package pt.ipl.diariolx.domain.users.value

@JvmInline
value class Name(
    val value: String,
) {
    companion object {
        // https://pt.stackoverflow.com/questions/15738/como-validar-com-regex-uma-string-contendo-apenas-letras-espa%C3%A7os-em-branco-e-le
        private val REGEX = Regex("^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'-]+$")
        const val MIN_LENGTH = 3
        const val MAX_LENGTH = 20

        fun parse(value: String?): Name? = if (value != null && isValid(value)) Name(value) else null

        fun isValid(value: String): Boolean =
            value.isNotBlank() &&
                value.length in MIN_LENGTH..MAX_LENGTH &&
                REGEX.matches(value)
    }
}
