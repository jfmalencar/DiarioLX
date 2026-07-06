package pt.ipl.diariolx.domain.content.value

data class ContentParent(
    val id: Int,
    val title: String,
    val slug: String?,
    val image: String? = null,
)
