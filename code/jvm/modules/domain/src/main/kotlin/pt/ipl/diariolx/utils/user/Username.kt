package pt.ipl.diariolx.utils.user

data class Username(val value: String) {
    init {
        require(value.isNotBlank()) { "Username cannot be blank" }
        require(value.length in MIN_USERNAME_LENGTH..MAX_USERNAME_LENGTH) {
            "Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters"
        }
        require(
            Regex("^[a-zA-Z0-9_.-]+$").matches(value),
        ) { "Username must contain only alphanumeric characters, underscores, and hyphens" }
    }

    companion object {
        const val MIN_USERNAME_LENGTH = 3
        const val MAX_USERNAME_LENGTH = 30
    }
}

fun String.isUsernameValid(): Boolean {
    return this.isNotBlank() &&
        this.length in Username.MIN_USERNAME_LENGTH..Username.MAX_USERNAME_LENGTH &&
        Regex("^[a-zA-Z0-9_.-]+$").matches(this)
}
