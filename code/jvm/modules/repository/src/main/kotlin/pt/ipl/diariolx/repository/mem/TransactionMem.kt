package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.CategoryRepository
import pt.ipl.diariolx.repository.InviteRepository
import pt.ipl.diariolx.repository.TagRepository
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.UserRepository

class TransactionMem(
    override val categoryRepository: CategoryRepository,
    override val userRepository: UserRepository,
    override val inviteRepository: InviteRepository,
    override val tagRepository: TagRepository,
    override val articleRepository: ArticleRepositoryMem,
    override val fileRepository: FileRepositoryMem,
) : Transaction {
    override fun rollback() {
        TODO("Not yet implemented")
    }
}
