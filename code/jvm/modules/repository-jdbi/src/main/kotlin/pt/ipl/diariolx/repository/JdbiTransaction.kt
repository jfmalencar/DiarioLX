package pt.ipl.diariolx.repository

import org.jdbi.v3.core.Handle
import org.slf4j.Logger

class JdbiTransaction(
    private val handle: Handle,
    private val logger: Logger
) : Transaction {
    override val categoryRepository: CategoryRepository = JdbiCategoryRepository(handle)
    override val tagRepository: TagRepository = JdbiTagRepository(handle)
    override val inviteRepository: InviteRepository = JdbiInviteRepository(handle, logger)
    override val userRepository: UserRepository = JdbiUserRepository(handle, logger)

    override fun rollback() {
        handle.rollback()
    }
}
