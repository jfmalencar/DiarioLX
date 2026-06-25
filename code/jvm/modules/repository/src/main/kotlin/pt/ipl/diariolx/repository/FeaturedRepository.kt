package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.FeaturedSectionInput

interface FeaturedRepository {
    fun getHomepage(): List<FeaturedSection>

    fun saveHomepage(sections: List<FeaturedSectionInput>)

    fun findPublishedIds(ids: List<Int>): Set<Int>
}
