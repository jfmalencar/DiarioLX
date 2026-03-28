package pt.ipl.diariolx.repository

import org.jdbi.v3.core.Handle

class JdbiTransaction(
    private val handle: Handle,
) : Transaction {
    override val categoryRepository: CategoryRepository = JdbiCategoryRepository(handle)
    override val tagRepository: TagRepository = JdbiTagRepository(handle)

    override fun rollback() {
        handle.rollback()
    }
}
