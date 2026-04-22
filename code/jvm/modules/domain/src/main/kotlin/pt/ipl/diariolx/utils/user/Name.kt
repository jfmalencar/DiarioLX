package pt.ipl.diariolx.utils.user

import pt.ipl.diariolx.utils.user.Name.Companion.MAX_NAME_LENGTH
import pt.ipl.diariolx.utils.user.Name.Companion.MIN_NAME_LENGTH

data class Name(val value: String) {
    init {
        require(value.isNotBlank()) { "Name cannot be blank" }
        require(value.length in MIN_NAME_LENGTH..MAX_NAME_LENGTH) {
            "Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters"
        }
        // The Regex only allows a short set of accented letters
        // https://pt.stackoverflow.com/questions/15738/como-validar-com-regex-uma-string-contendo-apenas-letras-espa%C3%A7os-em-branco-e-le
        require(Regex("^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'-]+$").matches(value)) { "Name must contain only letters" }
    }

    companion object {
        const val MIN_NAME_LENGTH = 3
        const val MAX_NAME_LENGTH = 20
    }
}

fun String.isNameValid(): Boolean {
    return this.isNotBlank()
            && this.length in MIN_NAME_LENGTH..MAX_NAME_LENGTH
            && Regex("^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'-]+$").matches(this)
}