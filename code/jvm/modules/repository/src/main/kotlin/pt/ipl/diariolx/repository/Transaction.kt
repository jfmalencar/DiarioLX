package pt.ipl.diariolx.repository

interface Transaction {
    val categoryRepository: CategoryRepository
    val tagRepository: TagRepository
    val userRepository: UserRepository
    val inviteRepository: InviteRepository
    val contentRepository: ContentRepository
    val mediaRepository: MediaRepository

    // other repository types
    fun rollback()
}
