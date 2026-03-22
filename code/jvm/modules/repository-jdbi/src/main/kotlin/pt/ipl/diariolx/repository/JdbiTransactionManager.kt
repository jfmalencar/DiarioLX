package pt.ipl.diariolx.repository

import jakarta.inject.Named
import org.jdbi.v3.core.Jdbi

@Named
class JdbiTransactionManager(
    private val jdbi: Jdbi,
) : TransactionManager {
    override fun <R> run(block: (Transaction) -> R): R =
        jdbi.inTransaction<R, Exception> { handle ->
            val transaction = JdbiTransaction(handle)
            block(transaction)
        }
}

class JdbiTransactionManagerRollback(
    private val jdbi: Jdbi,
) : TransactionManager {
    override fun <R> run(block: (Transaction) -> R): R =
        jdbi.inTransaction<R, Exception> { handle ->
            val transaction = JdbiTransaction(handle)
            try {
                block(transaction)
            } finally {
                handle.rollback()
            }
        }
}
