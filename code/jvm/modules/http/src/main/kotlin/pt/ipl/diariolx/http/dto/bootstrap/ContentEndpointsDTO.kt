package pt.ipl.diariolx.http.dto.bootstrap

data class ContentEndpointsDTO(
    val list: LinkDTO,
    val getBySlug: LinkDTO,
    val getById: LinkDTO,
    val internalList: LinkDTO,
    val internalGetBySlug: LinkDTO,
    val internalGetById: LinkDTO,
    val create: LinkDTO,
    val update: LinkDTO,
    val delete: LinkDTO,
    val archive: LinkDTO,
    val publish: LinkDTO,
    val reject: LinkDTO,
)
