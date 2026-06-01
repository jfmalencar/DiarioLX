package pt.ipl.diariolx.domain.shared.value

@JvmInline
value class Slug(
    val value: String,
) {
    companion object {
        private val SLUG_REGEX =
            Regex("^[a-z0-9]+(?:-[a-z0-9]+)*$")

        fun parse(value: String?): Slug? = if (value != null && isValid(value)) Slug(value) else null

        fun isValid(value: String?): Boolean {
            if (value.isNullOrBlank()) return false
            return SLUG_REGEX.matches(value)
        }
    }
}
