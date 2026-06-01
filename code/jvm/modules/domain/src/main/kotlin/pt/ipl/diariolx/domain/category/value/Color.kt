package pt.ipl.diariolx.domain.category.value

@JvmInline
value class Color(
    val value: String,
) {
    companion object {
        private val HEX_COLOR_REGEX =
            Regex("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")

        fun parse(value: String?): Color? = if (value != null && isValid(value)) Color(value) else null

        fun isValid(value: String?): Boolean {
            if (value.isNullOrBlank()) return false
            return HEX_COLOR_REGEX.matches(value)
        }
    }
}
