package pt.ipl.diariolx.http.dto.bootstrap

import pt.ipl.diariolx.domain.settings.NavigationView
import pt.ipl.diariolx.http.dto.settings.ContactDTO
import pt.ipl.diariolx.http.dto.settings.SocialDTO

data class NavCategoryDTO(
    val name: String,
    val slug: String,
    val color: String,
)

data class NavigationDTO(
    val featured: List<NavCategoryDTO>,
    val sections: List<NavCategoryDTO>,
    val showPhotos: Boolean,
    val showPodcasts: Boolean,
    val showVideos: Boolean,
)

data class SettingsBootstrapDTO(
    val social: SocialDTO,
    val contact: ContactDTO,
    val navigation: NavigationDTO,
) {
    companion object {
        fun from(
            map: Map<String, String>,
            navigation: NavigationView,
        ) = SettingsBootstrapDTO(
            social =
                SocialDTO(
                    facebook = map["social.facebook"].orEmpty(),
                    twitter = map["social.twitter"].orEmpty(),
                    instagram = map["social.instagram"].orEmpty(),
                ),
            contact =
                ContactDTO(
                    email = map["contact.email"].orEmpty(),
                    address = map["contact.address"].orEmpty(),
                ),
            navigation =
                NavigationDTO(
                    featured = navigation.featured.map { NavCategoryDTO(it.name, it.slug.value, it.color.value) },
                    sections = navigation.sections.map { NavCategoryDTO(it.name, it.slug.value, it.color.value) },
                    showPhotos = navigation.showPhotos,
                    showPodcasts = navigation.showPodcasts,
                    showVideos = navigation.showVideos,
                ),
        )
    }
}
