package pt.ipl.diariolx.domain.settings

import pt.ipl.diariolx.domain.category.CategorySummary

data class NavigationView(
    val featured: List<CategorySummary>,
    val sections: List<CategorySummary>,
    val showPhotos: Boolean,
    val showPodcasts: Boolean,
    val showVideos: Boolean,
)
