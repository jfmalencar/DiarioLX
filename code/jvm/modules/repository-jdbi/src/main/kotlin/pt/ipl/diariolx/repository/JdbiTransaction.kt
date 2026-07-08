package pt.ipl.diariolx.repository

import org.jdbi.v3.core.Handle

class JdbiTransaction(
    private val handle: Handle,
) : Transaction {
    override val categoryRepository: CategoryRepository = JdbiCategoryRepository(handle)
    override val tagRepository: TagRepository = JdbiTagRepository(handle)
    override val inviteRepository: InviteRepository = JdbiInviteRepository(handle)
    override val userRepository: UserRepository = JdbiUserRepository(handle)
    override val contentRepository: ContentRepository = JdbiContentRepository(handle)
    override val mediaRepository: MediaRepository = JdbiMediaRepository(handle)
    override val featuredRepository: FeaturedRepository = JdbiFeaturedRepository(handle)
    override val settingsRepository: SettingsRepository = JdbiSettingsRepository(handle)
    override val passwordResetRepository: PasswordResetRepository = JdbiPasswordResetRepository(handle)

    override fun rollback() {
        handle.rollback()
    }
}
