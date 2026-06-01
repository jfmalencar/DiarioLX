package pt.ipl.diariolx.http.dto.guest

import pt.ipl.diariolx.http.dto.content.CategorySummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO
import pt.ipl.diariolx.http.dto.user.TeamMemberResponseDTO

data class HomepageResponseDTO(
    val mainArticle: ContentSummaryResponseDTO? = null,
    val featuredArticles: List<ContentSummaryResponseDTO>? = null,
    val latestArticles: List<ContentSummaryResponseDTO>? = null,
    val lisboaCidadeAberta: List<ContentSummaryResponseDTO>,
    val aFundo: List<ContentSummaryResponseDTO>,
    val especiais: List<ContentSummaryResponseDTO>,
    val categories: List<CategorySummaryResponseDTO>? = null,
    val latestPhotos: List<ContentSummaryResponseDTO>,
    val latestPodcasts: List<ContentSummaryResponseDTO>,
    val latestVideos: List<ContentSummaryResponseDTO>,
    val team: List<TeamMemberResponseDTO>? = null,
)
