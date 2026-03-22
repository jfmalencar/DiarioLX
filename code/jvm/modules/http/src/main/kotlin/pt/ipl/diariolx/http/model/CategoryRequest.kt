package pt.ipl.diariolx.http.model

data class CategoryRequest(
    val name: String,
    val slug: String,
    val description: String? = null,
    val color: String,
    val parentId: Int? = null,
)
