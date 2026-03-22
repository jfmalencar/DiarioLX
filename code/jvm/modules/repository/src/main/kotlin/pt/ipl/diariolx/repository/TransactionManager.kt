package pt.ipl.diariolx.repository

interface TransactionManager {
    fun <R> run(block: (Transaction) -> R): R
}
