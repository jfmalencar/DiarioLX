package pt.ipl.diariolx.domain.category

import kotlinx.datetime.Instant

data class Category(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String? = null,
    val quantity: Int,
    val color: String? = null,
    val parentId: Int? = null,
    val parentName: String? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
)
