package pt.ipl.diariolx.domain.tag

data class UpdateTag(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String? = null,
)
