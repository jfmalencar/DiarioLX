package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentHistory

sealed class ContentError(
    val message: String,
) {
    object EmptyField : ContentError("Content field cannot be empty")

    object InvalidType : ContentError("Content type is invalid")

    object InvalidSlug : ContentError("Content slug must be unique")

    object SlugAlreadyExists : ContentError("Content slug already exists")

    object ContentNotFound : ContentError("Content not found")

    object CategoryNotFound : ContentError("Category not found")

    object FeaturedMediaIdNotFound : ContentError("Featured Media not found")

    object AuthorNotFound : ContentError("Author not found")

    object TagNotFound : ContentError("Not found")
}

typealias ContentResult = Either<ContentError, Content>

typealias ContentUpdateResult = Either<ContentError, Unit>

typealias ContentHistoryResult = Either<ContentError, List<ContentHistory>>

typealias ContentCreateResult = Either<ContentError, Int>

typealias ContentValidationResult = Either<ContentError, Unit>
