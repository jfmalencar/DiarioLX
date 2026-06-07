package pt.ipl.diariolx.http.dto.bootstrap

data class ContentEndpointsDTO(
    val internalList: LinkDTO,
    val internalGetById: LinkDTO,
    val create: LinkDTO,
    val update: LinkDTO,
    val delete: LinkDTO,
    val archive: LinkDTO,
    val publish: LinkDTO,
    val submit: LinkDTO,
    val reject: LinkDTO,
)
