package pt.ipl.diariolx.domain.media

enum class UploadType(
    val path: String,
) {
    CONTENT_IMAGES("images"),
    CONTENT_VIDEOS("videos"),
    CONTENT_AUDIOS("audios"),
    PROFILE_PICTURES("profile"),
}
