package pt.ipl.diariolx.http.model

data class TagRequestDTO(
    val name: String,
    val slug: String,
    val description: String? = null,
)
