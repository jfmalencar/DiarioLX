package pt.ipl.diariolx.domain.category

import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug

data class CategorySummary(
    val id: Int,
    val name: String,
    val slug: Slug,
    val color: Color,
)
