package pt.ipl.diariolx.domain.content

data class NewContent(
    val title: String,
    val headline: String,
    val slug: String,
    val categoryId: Int,
    val featuredMediaId: Int,
    val publishedAt: String?,
    val authors: List<ContentAuthor>,
    val tags: List<ContentTag>,
    val blocks: List<NewContentBlock>,
)
