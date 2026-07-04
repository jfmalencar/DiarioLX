package pt.ipl.diariolx.domain.settings

import pt.ipl.diariolx.domain.category.CategorySummary

data class NavSection(
    val category: CategorySummary,
    val children: List<CategorySummary>,
)
