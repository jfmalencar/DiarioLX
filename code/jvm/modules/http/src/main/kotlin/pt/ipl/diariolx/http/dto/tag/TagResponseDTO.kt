package pt.ipl.diariolx.http.dto.tag

import pt.ipl.diariolx.domain.tag.Tag

data class TagResponseDTO(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String? = null,
    val quantity: Int,
    val createdAt: String,
    val updatedAt: String,
    val archivedAt: String? = null,
) {
    companion object {
        fun from(tag: Tag) =
            TagResponseDTO(
                id = tag.id,
                name = tag.name,
                slug = tag.slug.value,
                description = tag.description,
                quantity = tag.quantity,
                createdAt = tag.createdAt.toString(),
                updatedAt = tag.updatedAt.toString(),
                archivedAt = tag.archivedAt?.toString(),
            )
    }
}
