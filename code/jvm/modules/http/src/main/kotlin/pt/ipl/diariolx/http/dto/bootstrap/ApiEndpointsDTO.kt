package pt.ipl.diariolx.http.dto.bootstrap

data class ApiEndpointsDTO(
    val auth: AuthEndpointsDTO,
    val backoffice: BackofficeEndpointsDTO?,
    val guest: GuestEndpointsDTO,
)
