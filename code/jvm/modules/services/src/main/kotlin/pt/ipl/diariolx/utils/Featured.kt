package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.SectionType

sealed class FeaturedError(
    val message: String,
) {
    object CategoryRequired : FeaturedError("Category sections must have a category")

    object CategoryNotAllowed : FeaturedError("Only category sections can have a category")

    class TooManyArticles(
        type: SectionType,
        max: Int,
        got: Int,
    ) : FeaturedError("Section $type allows at most $max articles, got $got")

    class DuplicateSingleton(
        type: SectionType,
    ) : FeaturedError("Section $type can only appear once")

    class ContentNotFound(
        id: Int,
    ) : FeaturedError("Content $id not found or not published")
}

typealias FeaturedSectionResult = Either<FeaturedError, Unit>

typealias HomepageResult = List<FeaturedSection>
