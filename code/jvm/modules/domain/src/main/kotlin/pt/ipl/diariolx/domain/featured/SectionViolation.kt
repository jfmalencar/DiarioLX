package pt.ipl.diariolx.domain.featured

sealed interface SectionViolation {
    data object CategoryRequired : SectionViolation

    data object CategoryNotAllowed : SectionViolation

    data class TooManyArticles(
        val type: SectionType,
        val max: Int,
        val got: Int,
    ) : SectionViolation

    data class DuplicateSingleton(
        val type: SectionType,
    ) : SectionViolation
}
