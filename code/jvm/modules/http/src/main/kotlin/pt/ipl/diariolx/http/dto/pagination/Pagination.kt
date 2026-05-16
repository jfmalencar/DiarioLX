package pt.ipl.diariolx.http.dto.pagination

data class Pagination(
    val page: Int,
    val size: Int,
    val hasPrevious: Boolean,
    val hasNext: Boolean,
)
