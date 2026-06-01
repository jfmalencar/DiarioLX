package pt.ipl.diariolx.domain.tag

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.shared.value.Slug

data class Tag(
    val id: Int,
    val name: String,
    val slug: Slug,
    val description: String? = null,
    val quantity: Int,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
)
