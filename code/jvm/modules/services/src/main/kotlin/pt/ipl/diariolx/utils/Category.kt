package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.category.Category

sealed class CategoryError(
    val message: String,
) {
    object EmptyName : CategoryError("Category name cannot be empty")

    object InvalidSlug : CategoryError("Category slug must be unique")

    object SlugAlreadyExists : CategoryError("Category slug already exists")

    object InvalidParent : CategoryError("Invalid parent category")

    object InvalidColor : CategoryError("Invalid color")

    object CategoryNotFound : CategoryError("Category not found")

    object CategoryHasContents : CategoryError("Category cannot be deleted while it has associated contents")
}

typealias CategoryResult = Either<CategoryError, Category>

typealias CategoryUpdateResult = Either<CategoryError, Unit>

typealias CategoryCreateResult = Either<CategoryError, Int>

typealias CategoryValidationResult = Either<CategoryError, Unit>
