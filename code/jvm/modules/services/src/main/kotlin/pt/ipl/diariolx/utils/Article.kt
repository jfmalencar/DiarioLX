package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.content.Content

sealed class ContentError(
    val message: String,
) {
    object EmptyName : ContentError("Content name cannot be empty")

    object InvalidSlug : ContentError("Content slug must be unique")

    object SlugAlreadyExists : ContentError("Content slug already exists")

    object ContentNotFound : ContentError("Content not found")
}

typealias ContentResult = Either<ContentError, Content>

typealias ContentUpdateResult = Either<ContentError, Unit>

typealias ContentCreateResult = Either<ContentError, Int>

typealias ContentValidationResult = Either<ContentError, Unit>
