package pt.ipl.diariolx.http.dto.bootstrap

data class PasswordResetEndpointsDTO(
    val getById: LinkDTO,
    val getAll: LinkDTO,
    val approve: LinkDTO,
    val reject: LinkDTO,
)
