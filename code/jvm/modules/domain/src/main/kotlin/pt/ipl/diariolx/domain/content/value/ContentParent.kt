package pt.ipl.diariolx.domain.content.value

// Lightweight reference to a content's parent (an Episode's Podcast), enough to
// link back to it without loading the whole parent content.
data class ContentParent(
    val id: Int,
    val title: String,
    val slug: String?,
    // The parent podcast's featured image path — used as episode artwork.
    val image: String? = null,
)
