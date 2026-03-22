package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager

class TransactionManagerMem(
    categoryRepository: CategoryRepository,
) : TransactionManager {
    private val transaction = TransactionMem(categoryRepository)

    override fun <R> run(block: Transaction.() -> R): R = block(transaction)
}
