package pt.ipl.diariolx.http.dto.bootstrap

import pt.ipl.diariolx.http.HttpMethod

data class LinkDTO(
    val href: String,
    val method: HttpMethod,
)
