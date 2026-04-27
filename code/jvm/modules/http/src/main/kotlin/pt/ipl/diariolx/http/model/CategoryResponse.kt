package pt.ipl.diariolx.http.model

import pt.ipl.diariolx.domain.category.Category

data class CategoryResponse(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String?,
    val quantity: Int,
    val color: String?,
    val parentId: Int?,
    val parentName: String?,
    val createdAt: String,
    val updatedAt: String,
    val archivedAt: String?,
) {
    companion object {
        fun from(category: Category) =
            CategoryResponse(
                id = category.id,
                name = category.name,
                slug = category.slug,
                description = category.description,
                quantity = category.quantity,
                color = category.color,
                parentId = category.parentId,
                parentName = category.parentName,
                createdAt = category.createdAt.toString(),
                updatedAt = category.updatedAt.toString(),
                archivedAt = category.archivedAt?.toString(),
            )
    }
}
