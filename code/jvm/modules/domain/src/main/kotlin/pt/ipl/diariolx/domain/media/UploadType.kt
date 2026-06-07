package pt.ipl.diariolx.domain.media

enum class UploadType(
    val path: String,
    val purpose: String,
) {
    CONTENT_IMAGES("images", "GALLERY"),
    CONTENT_VIDEOS("videos", "GALLERY"),
    CONTENT_AUDIOS("audios", "GALLERY"),
    PROFILE_PICTURES("profile", "PROFILE"),
}
