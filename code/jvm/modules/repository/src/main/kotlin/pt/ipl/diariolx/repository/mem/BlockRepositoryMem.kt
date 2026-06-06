package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.content.value.NewContentBlock
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.repository.ContentBlockRepository

class BlockRepositoryMem(
    val mediaRepo: MediaRepositoryMem,
) : ContentBlockRepository {
    private val contentBlocks = mutableListOf<ContentBlock>()
    private var id = 0

    override fun create(newContentBlock: NewContentBlock): Int {
        val contentBlock =
            ContentBlock(
                id = ++id,
                type = newContentBlock.type,
                content = newContentBlock.content,
                media =
                    newContentBlock.mediaId?.let {
                        mediaRepo.get(it)?.let {
                            MediaSummary(
                                it.id,
                                it.mimeType.split("/").first(),
                                it.objectKey,
                                it.thumbnailObjectKey,
                                it.altText,
                                it.mimeType,
                                it.sizeBytes,
                            )
                        }
                    },
            )
        contentBlocks.add(contentBlock)
        return contentBlock.id
    }

    override fun update(
        id: Int,
        newContentBlock: NewContentBlock,
    ) {
        val index = contentBlocks.indexOfFirst { it.id == id }
        if (index == -1) {
            throw IllegalArgumentException("ContentBlock with id $id not found")
        }
        val updatedContentBlock =
            ContentBlock(
                id = id,
                type = newContentBlock.type,
                content = newContentBlock.content,
                media =
                    newContentBlock.mediaId?.let {
                        mediaRepo.get(it)?.let {
                            MediaSummary(
                                it.id,
                                it.mimeType.split("/").first(),
                                it.objectKey,
                                it.thumbnailObjectKey,
                                it.altText,
                                it.mimeType,
                                it.sizeBytes,
                            )
                        }
                    },
            )
        contentBlocks[index] = updatedContentBlock
    }

    override fun delete(id: Int) {
        val index = contentBlocks.indexOfFirst { it.id == id }
        if (index == -1) {
            throw IllegalArgumentException("ContentBlock with id $id not found")
        }
        contentBlocks.removeAt(index)
    }

    override fun get(id: Int): ContentBlock? = contentBlocks.find { it.id == id }
}
