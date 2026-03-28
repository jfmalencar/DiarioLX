package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.tag.Tag

data class TagQuery(
    val page: Int = 1,
    val limit: Int = 20,
    val archived: Boolean = false,
)

sealed class TagError(
    val message: String,
) {
    object EmptyName : TagError("Tag name cannot be empty")

    object InvalidSlug : TagError("Tag slug must be unique")

    object SlugAlreadyExists : TagError("Tag slug already exists")

    object TagNotFound : TagError("Tag not found")
}

typealias TagResult = Either<TagError, Tag>

typealias TagUpdateResult = Either<TagError, Unit>

typealias TagCreateResult = Either<TagError, Int>

typealias TagValidationResult = Either<TagError, Unit>
