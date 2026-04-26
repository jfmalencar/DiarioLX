package pt.ipl.diariolx.repository

interface Transaction {
    val categoryRepository: CategoryRepository
    val tagRepository: TagRepository
    val articleRepository: ArticleRepository
    val fileRepository: FileRepository

    // other repository types
    fun rollback()
}
