package pt.ipl.diariolx.utils.user

@JvmInline
value class PasswordHash(
    val value: String,
)

fun String.isPasswordValid(): Boolean {
    // Regex obtained on Stack Overflow:
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    // "Password must contain uppercase and lowercase letters, at least one number, one special character and be at least 8 characters long."
    return Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,25}$").matches(this)
}
