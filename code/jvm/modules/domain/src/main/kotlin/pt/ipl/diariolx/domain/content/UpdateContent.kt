package pt.ipl.diariolx.domain.content

import pt.ipl.diariolx.domain.content.value.ContentAuthor
import pt.ipl.diariolx.domain.content.value.ContentTag
import pt.ipl.diariolx.domain.content.value.NewContentBlock

data class UpdateContent(
    val id: Int,
    val title: String,
    val headline: String,
    // ----------------------------
    val featuredMediaId: Int?,
    val slug: String?,
    val categoryId: Int?,
    // ----------------------------
    val authors: List<ContentAuthor>,
    val tags: List<ContentTag>,
    val blocks: List<NewContentBlock>,
    val state: ContentState,
)
