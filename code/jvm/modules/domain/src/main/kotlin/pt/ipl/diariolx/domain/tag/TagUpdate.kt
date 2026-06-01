package pt.ipl.diariolx.domain.tag

import pt.ipl.diariolx.domain.shared.value.Slug

data class TagUpdate(
    val id: Int,
    val name: String,
    val slug: Slug,
    val description: String? = null,
)
