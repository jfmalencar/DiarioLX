package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.PageResponse

fun <T> paginate(
    page: Int,
    size: Int,
    fetchItems: (limit: Int, offset: Int) -> List<T>,
): PageResponse<T> {
    val safePage = page.coerceAtLeast(1)
    val safeSize = size.coerceAtLeast(1).coerceAtMost(30)

    val limit = safeSize + 1
    val offset = (safePage - 1) * safeSize
    val items = fetchItems(limit, offset)
    val hasNext = items.size == limit

    return PageResponse(
        items = if (hasNext) items.dropLast(1) else items,
        page = safePage,
        pageSize = safeSize,
        hasNext = hasNext,
        hasPrevious = safePage > 1,
    )
}
