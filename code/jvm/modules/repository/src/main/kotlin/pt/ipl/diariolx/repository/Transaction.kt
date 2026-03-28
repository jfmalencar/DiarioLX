package pt.ipl.diariolx.repository

interface Transaction {
    val categoryRepository: CategoryRepository
    val tagRepository: TagRepository

    // other repository types
    fun rollback()
}
