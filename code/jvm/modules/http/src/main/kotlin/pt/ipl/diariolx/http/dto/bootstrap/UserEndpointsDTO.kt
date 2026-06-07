package pt.ipl.diariolx.http.dto.bootstrap

data class UserEndpointsDTO(
    val me: LinkDTO,
    val list: LinkDTO,
    val get: LinkDTO,
    val create: LinkDTO,
    val update: LinkDTO,
    val delete: LinkDTO,
    val deactivate: LinkDTO,
    val avatar: LinkDTO,
)
