package pt.ipl.diariolx.http.dto.bootstrap

data class CategoryEndpointsDTO(
    val list: LinkDTO,
    val get: LinkDTO,
    val create: LinkDTO,
    val update: LinkDTO,
    val delete: LinkDTO,
    val archive: LinkDTO,
    val unarchive: LinkDTO,
)
