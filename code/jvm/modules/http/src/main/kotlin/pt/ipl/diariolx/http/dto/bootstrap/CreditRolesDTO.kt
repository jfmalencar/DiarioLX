package pt.ipl.diariolx.http.dto.bootstrap

import pt.ipl.diariolx.domain.media.CreditRole
import pt.ipl.diariolx.domain.media.MediaType

data class CreditRolesDTO(
    val value: CreditRole,
    val label: String,
    val mediaTypes: List<MediaType>,
)
