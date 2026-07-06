package pt.ipl.diariolx.domain.content.value

data class NewContentBlock(
    val type: String,
    val content: String?,
    val mediaId: Int?,
    val images: List<NewGalleryImage> = emptyList(),
)
