package pt.ipl.diariolx.domain.tag

import kotlinx.datetime.Instant

data class Tag(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String? = null,
    val quantity: Int,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
)
