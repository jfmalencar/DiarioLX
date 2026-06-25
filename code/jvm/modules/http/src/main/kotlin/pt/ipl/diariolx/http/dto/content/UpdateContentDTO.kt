package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.content.value.ContentAuthor
import pt.ipl.diariolx.domain.content.value.ContentTag
import pt.ipl.diariolx.domain.content.value.NewContentBlock

data class UpdateContentDTO(
    val id: Int,
    val title: String,
    val headline: String,
    val featuredMediaId: Int?,
    val slug: String?,
    val categoryId: Int?,
    val parentId: Int?,
    val embedUrl: String?,
    val authors: List<ContentAuthor>,
    val tags: List<ContentTag>,
    val blocks: List<NewContentBlock>,
)
