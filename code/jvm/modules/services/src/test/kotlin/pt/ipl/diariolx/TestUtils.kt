package pt.ipl.diariolx

import org.jdbi.v3.core.Jdbi
import org.postgresql.ds.PGSimpleDataSource
import pt.ipl.diariolx.repository.JdbiTransaction
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.repository.configureWithAppRequirements

private fun dbUrl(): String {
    val host = System.getenv("POSTGRES_HOST") ?: "localhost"
    val port = System.getenv("POSTGRES_PORT") ?: "5435"
    val db = System.getenv("POSTGRES_DB") ?: "db"
    val user = System.getenv("POSTGRES_USER") ?: "dbuser"
    val pass = System.getenv("POSTGRES_PASSWORD") ?: "changeit"
    return "jdbc:postgresql://$host:$port/$db?user=$user&password=$pass"
}

private val jdbi =
    Jdbi
        .create(
            PGSimpleDataSource().apply {
                setURL(dbUrl())
            },
        ).configureWithAppRequirements()

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
