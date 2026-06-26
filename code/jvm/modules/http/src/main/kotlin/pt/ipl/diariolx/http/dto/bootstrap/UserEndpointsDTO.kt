package pt.ipl.diariolx.http.dto.bootstrap

data class UserEndpointsDTO(
    val list: LinkDTO,
    val get: LinkDTO,
    val create: LinkDTO,
    val update: LinkDTO,
    val delete: LinkDTO,
    val status: LinkDTO,
    val avatar: LinkDTO,
    val setTeam: LinkDTO,
)
