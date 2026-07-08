package pt.ipl.diariolx.http.dto.pagination

import pt.ipl.diariolx.domain.PageResponse

data class Pagination(
    val page: Int,
    val size: Int,
    val hasPrevious: Boolean,
    val hasNext: Boolean,
) {
    companion object {
        fun of(response: PageResponse<*>): Pagination =
            Pagination(
                response.page,
                response.pageSize,
                response.hasPrevious,
                response.hasNext,
            )
    }
}
