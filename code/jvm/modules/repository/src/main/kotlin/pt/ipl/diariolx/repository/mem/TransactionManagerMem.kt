package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.FeaturedRepository
import pt.ipl.diariolx.repository.InviteRepository
import pt.ipl.diariolx.repository.PasswordResetRepository
import pt.ipl.diariolx.repository.SettingsRepository
import pt.ipl.diariolx.repository.TagRepository
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.repository.UserRepository

class TransactionManagerMem(
    categoryRepository: CategoryRepository,
    userRepository: UserRepository = UserRepositoryMem(),
    inviteRepository: InviteRepository = InviteRepositoryMem(),
    tagRepository: TagRepository,
    contentRepository: ContentRepositoryMem,
    mediaRepository: MediaRepositoryMem,
    featuredRepository: FeaturedRepository,
    settingsRepository: SettingsRepository = SettingsRepositoryMem(),
    passwordResetRepository: PasswordResetRepository = PasswordResetRepositoryMem(),
) : TransactionManager {
    private val transaction =
        TransactionMem(
            categoryRepository,
            userRepository,
            inviteRepository,
            tagRepository,
            contentRepository,
            mediaRepository,
            featuredRepository,
            settingsRepository,
            passwordResetRepository,
        )

    override fun <R> run(block: Transaction.() -> R): R = block(transaction)
}
