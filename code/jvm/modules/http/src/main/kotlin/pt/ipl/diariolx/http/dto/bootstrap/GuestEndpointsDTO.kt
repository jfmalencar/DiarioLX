package pt.ipl.diariolx.http.dto.bootstrap

data class GuestEndpointsDTO(
    val homepage: LinkDTO,
    val listContent: LinkDTO,
    val getContent: LinkDTO,
    val team: LinkDTO,
    val author: LinkDTO,
    val tag: LinkDTO,
    val category: LinkDTO,
)
