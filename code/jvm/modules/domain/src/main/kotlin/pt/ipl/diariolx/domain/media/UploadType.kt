package pt.ipl.diariolx.domain.media

enum class UploadType(
    val path: String,
) {
    CONTENT_GALLERY("content-gallery"),
    PROFILE_PICTURES("profile-pictures"),
}
