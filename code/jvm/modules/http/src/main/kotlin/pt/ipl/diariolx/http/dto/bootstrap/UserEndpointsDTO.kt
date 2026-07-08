package pt.ipl.diariolx.http.dto.bootstrap

data class UserEndpointsDTO(
    val list: LinkDTO,
    val get: LinkDTO,
    val create: LinkDTO,
    val update: LinkDTO,
    val changeRole: LinkDTO,
    val delete: LinkDTO,
    val status: LinkDTO,
    val avatar: LinkDTO,
    val setTeam: LinkDTO,
    val resetPassword: PasswordResetEndpointsDTO,
)
