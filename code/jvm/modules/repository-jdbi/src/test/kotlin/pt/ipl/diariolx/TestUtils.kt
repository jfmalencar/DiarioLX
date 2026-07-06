package pt.ipl.diariolx

import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.Jdbi
import org.postgresql.ds.PGSimpleDataSource
import pt.ipl.diariolx.repository.JdbiTransaction
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.repository.configureWithAppRequirements

private val jdbi =
    Jdbi
        .create(
            PGSimpleDataSource().apply {
                setURL(Environment.getDbUrl())
            },
        ).configureWithAppRequirements()

/** Hands the test a raw [Handle] for exercising a single repository. Always rolled back. */
fun testWithHandleAndRollback(block: (Handle) -> Unit) =
    jdbi.useTransaction<Exception> { handle ->
        block(handle)
        handle.rollback()
    }

fun testWithTransactionManagerAndRollback(block: (TransactionManager) -> Unit) =
    jdbi.useTransaction<Exception> { handle ->
        val transaction = JdbiTransaction(handle)

        val transactionManager =
            object : TransactionManager {
                override fun <R> run(block: (Transaction) -> R): R = block(transaction)
            }

        block(transactionManager)

        handle.rollback()
    }
