package pt.ipl.diariolx.domain.featured

data class SectionPolicy(
    val rules: Map<SectionType, SectionRule>,
) {
    fun rule(type: SectionType): SectionRule = rules.getValue(type)

    fun validate(sections: List<FeaturedSectionInput>): SectionViolation? {
        val seenSingletons = mutableSetOf<SectionType>()
        for (section in sections) {
            val rule = rule(section.type)
            if (rule.hasCategory && section.categoryId == null) return SectionViolation.CategoryRequired
            if (!rule.hasCategory && section.categoryId != null) return SectionViolation.CategoryNotAllowed
            if (section.contentIds.size > rule.maxArticles) {
                return SectionViolation.TooManyArticles(section.type, rule.maxArticles, section.contentIds.size)
            }
            if (!rule.canBeAdded && !seenSingletons.add(section.type)) {
                return SectionViolation.DuplicateSingleton(section.type)
            }
        }
        return null
    }
}
