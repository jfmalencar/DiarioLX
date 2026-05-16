package pt.ipl.diariolx.http.dto.tag

data class CreateUpdateTagRequestDTO(
    val name: String,
    val slug: String,
    val description: String? = null,
)
