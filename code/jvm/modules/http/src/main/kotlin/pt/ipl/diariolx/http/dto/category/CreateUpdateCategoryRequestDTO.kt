package pt.ipl.diariolx.http.dto.category

data class CreateUpdateCategoryRequestDTO(
    val name: String,
    val slug: String,
    val description: String? = null,
    val color: String,
    val parentId: Int? = null,
)
