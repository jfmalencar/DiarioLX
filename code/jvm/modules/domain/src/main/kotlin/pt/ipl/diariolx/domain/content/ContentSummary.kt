package pt.ipl.diariolx.domain.content

import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class ContentSummary(
    val id: Int,
    val title: String,
    val slug: String,
    val category: CategorySummary,
    val tag: TagSummary,
    val featuredImage: String?,
    val createdAt: String,
    val authors: List<String>,
    val isPublished: Boolean,
)
