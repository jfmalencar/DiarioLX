package pt.ipl.diariolx.domain.featured

data class SectionPolicy(
    val rules: Map<SectionType, SectionRule>,
) {
    fun rule(type: SectionType): SectionRule = rules.getValue(type)
}
