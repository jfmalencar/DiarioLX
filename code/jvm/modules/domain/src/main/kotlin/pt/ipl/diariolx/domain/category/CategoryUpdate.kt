package pt.ipl.diariolx.domain.category

import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug

data class CategoryUpdate(
    val id: Int,
    val name: String,
    val slug: Slug,
    val description: String? = null,
    val color: Color,
    val parentId: Int? = null,
)
