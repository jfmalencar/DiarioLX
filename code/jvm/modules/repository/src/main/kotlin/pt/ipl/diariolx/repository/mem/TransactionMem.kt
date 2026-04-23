package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.InviteRepository
import pt.ipl.diariolx.repository.TagRepository
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.UserRepository

class TransactionMem(
    override val categoryRepository: CategoryRepository,
    override val userRepository: UserRepository = UserRepositoryMem(),
    override val inviteRepository: InviteRepository = InviteRepositoryMem(),
    override val tagRepository: TagRepository = TagRepositoryMem(),
) : Transaction {
    override fun rollback() {
        TODO("Not yet implemented")
    }
}
