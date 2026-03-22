package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.category.Category

sealed class CategoryError(
    val message: String,
) {
    object EmptyName : CategoryError("Category name cannot be empty")

    object InvalidSlug : CategoryError("Category slug must be unique")

    object SlugAlreadyExists : CategoryError("Category slug already exists")

    object ParentNotFound : CategoryError("Parent category not found")

    object InvalidColor : CategoryError("Invalid color")

    object CategoryNotFound : CategoryError("Category not found")
}

typealias CategoryResult = Either<CategoryError, Category>

typealias CategoryUpdateResult = Either<CategoryError, Unit>

typealias CategoryCreateResult = Either<CategoryError, Int>

typealias ValidationResult = Either<CategoryError, Unit>
