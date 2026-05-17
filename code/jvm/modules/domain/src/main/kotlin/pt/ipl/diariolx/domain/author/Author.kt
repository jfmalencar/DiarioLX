package pt.ipl.diariolx.domain.author

data class Author(
    val id: Int,
    val name: String,
    val role: String?,
    val slug: String?,
)
