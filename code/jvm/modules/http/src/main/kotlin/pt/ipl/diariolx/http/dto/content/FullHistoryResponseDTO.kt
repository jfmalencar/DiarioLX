package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.content.ContentHistory

data class FullHistoryResponseDTO(
    val history: List<HistoryResponseDTO>,
) {
    companion object {
        fun from(internalHistory: List<ContentHistory>): FullHistoryResponseDTO {
            val historyDTOs =
                internalHistory.mapIndexed { index, history ->
                    HistoryResponseDTO(
                        id = (index + 1).toString(),
                        date = history.performedAt.toString(),
                        type = history.action.name.lowercase(),
                        by = history.reviewerName,
                        comment = history.comment,
                    )
                }
            return FullHistoryResponseDTO(historyDTOs)
        }
    }
}
