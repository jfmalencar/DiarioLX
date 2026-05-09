package pt.ipl.diariolx.domain

data class PageResponse<T>(
    val items: List<T>,
    val page: Int,
    val pageSize: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean,
)
