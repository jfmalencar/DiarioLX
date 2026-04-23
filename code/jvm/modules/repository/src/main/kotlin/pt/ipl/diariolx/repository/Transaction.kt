package pt.ipl.diariolx.repository

interface Transaction {
    val categoryRepository: CategoryRepository
    val tagRepository: TagRepository
    val userRepository: UserRepository
    val inviteRepository: InviteRepository

    // other repository types
    fun rollback()
}
