package pt.ipl.diariolx.http.dto.content

data class HistoryResponseDTO(
    val id: String,
    val date: String,
    val type: String,
    val by: String?,
    val comment: String?,
)
