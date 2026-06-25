package pt.ipl.diariolx.http.dto.guest

import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO

data class HomepageResponseDTO(
    val sections: List<SectionDTO>,
    val latestArticles: List<ContentSummaryResponseDTO>,
)
