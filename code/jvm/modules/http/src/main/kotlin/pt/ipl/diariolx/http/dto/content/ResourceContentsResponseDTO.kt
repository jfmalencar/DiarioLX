package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.http.dto.pagination.Pagination

data class ResourceContentsResponseDTO<T>(
    val resource: T,
    val items: List<ContentSummaryResponseDTO>,
    val pagination: Pagination,
)
