package pt.ipl.diariolx.domain.category

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug

data class Category(
    val id: Int,
    val name: String,
    val slug: Slug,
    val description: String? = null,
    val quantity: Int,
    val color: Color,
    val parentId: Int? = null,
    val parentName: String? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
)
