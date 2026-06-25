package pt.ipl.diariolx.domain.featured

data class SectionRule(
    val maxArticles: Int,
    val canBeAdded: Boolean,
    val hasCategory: Boolean,
)
