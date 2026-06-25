package pt.ipl.diariolx.repository

interface Transaction {
    val categoryRepository: CategoryRepository
    val tagRepository: TagRepository
    val userRepository: UserRepository
    val inviteRepository: InviteRepository
    val contentRepository: ContentRepository
    val mediaRepository: MediaRepository
    val featuredRepository: FeaturedRepository
    val settingsRepository: SettingsRepository

    // other repository types
    fun rollback()
}
