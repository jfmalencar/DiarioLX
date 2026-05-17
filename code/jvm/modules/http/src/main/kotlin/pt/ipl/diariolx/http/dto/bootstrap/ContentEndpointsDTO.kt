package pt.ipl.diariolx.http.dto.bootstrap

data class ContentEndpointsDTO(
    val list: LinkDTO,
    val get: LinkDTO,
    val create: LinkDTO,
)
