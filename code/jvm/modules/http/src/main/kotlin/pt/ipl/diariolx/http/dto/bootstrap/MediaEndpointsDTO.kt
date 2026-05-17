package pt.ipl.diariolx.http.dto.bootstrap

data class MediaEndpointsDTO(
    val list: LinkDTO,
    val signedUrl: LinkDTO,
    val userSignedUrl: LinkDTO,
    val completeUpload: LinkDTO,
)
