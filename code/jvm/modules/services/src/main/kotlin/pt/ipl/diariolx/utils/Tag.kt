package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.tag.Tag

sealed class TagError(
    val message: String,
) {
    object EmptyName : TagError("Tag name cannot be empty")

    object InvalidSlug : TagError("Tag slug must be unique")

    object SlugAlreadyExists : TagError("Tag slug already exists")

    object TagNotFound : TagError("Tag not found")

    object TagHasContents : TagError("Tag cannot be deleted while it has associated contents")
}

typealias TagResult = Either<TagError, Tag>

typealias TagUpdateResult = Either<TagError, Unit>

typealias TagCreateResult = Either<TagError, Int>

typealias TagValidationResult = Either<TagError, Unit>
