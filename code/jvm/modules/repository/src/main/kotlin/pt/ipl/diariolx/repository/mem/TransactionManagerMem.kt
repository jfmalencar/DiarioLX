package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.TagRepository
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager

class TransactionManagerMem(
    categoryRepository: CategoryRepository,
    tagRepository: TagRepository,
    articleRepository: ArticleRepositoryMem,
    fileRepository: FileRepositoryMem,
) : TransactionManager {
    private val transaction =
        TransactionMem(
            categoryRepository,
            tagRepository,
            articleRepository,
            fileRepository,
        )

    override fun <R> run(block: Transaction.() -> R): R = block(transaction)
}
