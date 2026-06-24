package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant

data class ContentHistory(
    val contentId: Int,
    val reviewerName: String?,
    val action: ReviewAction,
    val comment: String?,
    val performedAt: Instant
)