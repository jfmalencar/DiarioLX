package pt.ipl.diariolx.http.dto.pagination

data class PaginatedResponseDTO<T>(
    val items: List<T>,
    val pagination: Pagination,
)
