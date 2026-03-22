package pt.ipl.diariolx.utils

object ColorValidator {
    private val HEX_COLOR_REGEX =
        Regex("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")

    fun isValid(value: String?): Boolean {
        if (value.isNullOrBlank()) return false
        return HEX_COLOR_REGEX.matches(value)
    }
}
