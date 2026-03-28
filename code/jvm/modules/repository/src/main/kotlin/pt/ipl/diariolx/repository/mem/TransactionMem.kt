package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.TagRepository
import pt.ipl.diariolx.repository.Transaction

class TransactionMem(
    override val categoryRepository: CategoryRepository,
    override val tagRepository: TagRepository = TagRepositoryMem(),
) : Transaction {
    override fun rollback() {
        TODO("Not yet implemented")
    }
}
