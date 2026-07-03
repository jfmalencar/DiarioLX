package pt.ipl.diariolx.http.dto.settings

data class SocialDTO(
    val facebook: String,
    val twitter: String,
    val instagram: String,
)

data class ContactDTO(
    val email: String,
    val address: String,
)

data class PublicationDTO(
    val erc: String,
    val periodicity: String,
    val owner: String,
    val nipc: String,
)

data class NavConfigDTO(
    val featuredCategories: List<String>,
    val showPhotos: Boolean,
    val showPodcasts: Boolean,
    val showVideos: Boolean,
)

data class SettingsResponseDTO(
    val social: SocialDTO,
    val contact: ContactDTO,
    val publication: PublicationDTO,
    val navigation: NavConfigDTO,
) {
    companion object {
        fun from(map: Map<String, String>) =
            SettingsResponseDTO(
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
                publication =
                    PublicationDTO(
                        erc = map["publication.erc"].orEmpty(),
                        periodicity = map["publication.periodicity"].orEmpty(),
                        owner = map["publication.owner"].orEmpty(),
                        nipc = map["publication.nipc"].orEmpty(),
                    ),
                navigation =
                    NavConfigDTO(
                        featuredCategories =
                            map["nav.featuredCategories"]
                                .orEmpty()
                                .split(",")
                                .map { it.trim() }
                                .filter { it.isNotEmpty() },
                        showPhotos = map["nav.showPhotos"] == "true",
                        showPodcasts = map["nav.showPodcasts"] == "true",
                        showVideos = map["nav.showVideos"] == "true",
                    ),
            )
    }
}

data class SettingsRequestDTO(
    val social: SocialDTO,
    val contact: ContactDTO,
    val publication: PublicationDTO,
    val navigation: NavConfigDTO,
) {
    fun toMap(): Map<String, String> =
        mapOf(
            "social.facebook" to social.facebook,
            "social.twitter" to social.twitter,
            "social.instagram" to social.instagram,
            "contact.email" to contact.email,
            "contact.address" to contact.address,
            "publication.erc" to publication.erc,
            "publication.periodicity" to publication.periodicity,
            "publication.owner" to publication.owner,
            "publication.nipc" to publication.nipc,
            "nav.featuredCategories" to navigation.featuredCategories.joinToString(","),
            "nav.showPhotos" to navigation.showPhotos.toString(),
            "nav.showPodcasts" to navigation.showPodcasts.toString(),
            "nav.showVideos" to navigation.showVideos.toString(),
        )
}
