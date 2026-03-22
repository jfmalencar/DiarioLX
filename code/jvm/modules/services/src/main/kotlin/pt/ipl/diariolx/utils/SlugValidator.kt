package pt.ipl.diariolx.utils

object SlugValidator {
    private val SLUG_REGEX =
        Regex("^[a-z0-9]+(?:-[a-z0-9]+)*$")

    fun isValid(value: String?): Boolean {
        if (value.isNullOrBlank()) return false
        return SLUG_REGEX.matches(value)
    }
}
