package pt.ipl.diariolx.http.dto.bootstrap

data class SectionTypeConfigDTO(
    val type: String,
    val maxArticles: Int,
    val canBeAdded: Boolean,
    val hasCategory: Boolean,
)
