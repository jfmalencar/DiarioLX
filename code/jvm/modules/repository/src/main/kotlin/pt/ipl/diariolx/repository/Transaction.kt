package pt.ipl.diariolx.repository

interface Transaction {
    val categoryRepository: CategoryRepository

    // other repository types
    fun rollback()
}
