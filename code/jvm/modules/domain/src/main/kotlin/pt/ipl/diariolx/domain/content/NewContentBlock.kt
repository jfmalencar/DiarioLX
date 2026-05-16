package pt.ipl.diariolx.domain.content

data class NewContentBlock(
    val type: String,
    val content: String?,
    val mediaId: Int?,
)
