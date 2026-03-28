package pt.ipl.diariolx.domain.tag

data class NewTag(
    val name: String,
    val slug: String,
    val description: String? = null,
)
