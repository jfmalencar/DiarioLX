package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.InviteRepository
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.repository.UserRepository

class TransactionManagerMem(
    categoryRepository: CategoryRepository,
    userRepository: UserRepository = UserRepositoryMem(),
    inviteRepository: InviteRepository = InviteRepositoryMem(),
) : TransactionManager {
    private val transaction = TransactionMem(categoryRepository, userRepository, inviteRepository)

    override fun <R> run(block: Transaction.() -> R): R = block(transaction)
}
