package pt.ipl.diariolx.http.dto.bootstrap

data class BackofficeEndpointsDTO(
    val users: UserEndpointsDTO,
    val tags: TagEndpointsDTO,
    val categories: CategoryEndpointsDTO,
    val invites: InviteEndpointsDTO,
    val contents: ContentEndpointsDTO,
    val medias: MediaEndpointsDTO,
)
