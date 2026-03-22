package pt.ipl.diariolx.domain.category

data class UpdateCategory(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String? = null,
    val color: String,
    val parentId: Int? = null,
)
