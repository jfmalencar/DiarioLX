package pt.ipl.diariolx.domain.article

data class NewArticleBlock(
    val type: String,
    val content: String?,
    val mediaId: Int?,
)
