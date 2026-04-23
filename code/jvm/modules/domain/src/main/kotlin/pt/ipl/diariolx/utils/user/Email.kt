package pt.ipl.diariolx.utils.user

import pt.ipl.diariolx.utils.user.Email.Companion.MAX_EMAIL_LENGTH
import pt.ipl.diariolx.utils.user.Email.Companion.MIN_EMAIL_LENGTH

data class Email(val value: String) {
    init {
        require(value.isNotBlank()) { "Email cannot be blank" }
        require(value.length in MIN_EMAIL_LENGTH..MAX_EMAIL_LENGTH) {
            "Email cannot be longer than $MAX_EMAIL_LENGTH"
            "Email cannot exceed 30 characters"
        }
        require(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$").matches(value)) { "Invalid email format" }
    }

    companion object {
        const val MIN_EMAIL_LENGTH = 5
        const val MAX_EMAIL_LENGTH = 45
    }

    override fun equals(other: Any?): Boolean {
        return other is Email && this.value.equals(other.value, ignoreCase = false)
    }
}

fun String.isEmailValid(): Boolean {
    return this.isNotBlank() &&
        this.length in MIN_EMAIL_LENGTH..MAX_EMAIL_LENGTH &&
        Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$").matches(this)
}
