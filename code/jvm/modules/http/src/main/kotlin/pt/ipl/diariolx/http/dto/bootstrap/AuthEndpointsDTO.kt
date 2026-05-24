package pt.ipl.diariolx.http.dto.bootstrap

data class AuthEndpointsDTO(
    val register: LinkDTO,
    val login: LinkDTO,
    val logout: LinkDTO,
    val refresh: LinkDTO,
)
