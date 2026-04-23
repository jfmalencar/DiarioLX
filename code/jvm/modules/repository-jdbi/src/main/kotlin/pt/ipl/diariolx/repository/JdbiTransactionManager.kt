package pt.ipl.diariolx.repository

import jakarta.inject.Named
import org.jdbi.v3.core.Jdbi
import org.slf4j.Logger

@Named
class JdbiTransactionManager(
    private val jdbi: Jdbi,
    private val logger: Logger,
) : TransactionManager {
    override fun <R> run(block: (Transaction) -> R): R =
        jdbi.inTransaction<R, Exception> { handle ->
            val transaction = JdbiTransaction(handle, logger)
            block(transaction)
        }
}

class JdbiTransactionManagerRollback(
    private val jdbi: Jdbi,
    private val logger: Logger,
) : TransactionManager {
    override fun <R> run(block: (Transaction) -> R): R =
        jdbi.inTransaction<R, Exception> { handle ->
            val transaction = JdbiTransaction(handle, logger)
            try {
                block(transaction)
            } finally {
                handle.rollback()
            }
        }
}
