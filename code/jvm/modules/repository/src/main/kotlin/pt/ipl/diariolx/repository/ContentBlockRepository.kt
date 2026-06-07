package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.content.value.NewContentBlock

interface ContentBlockRepository {
    fun create(newContentBlock: NewContentBlock): Int

    fun update(
        id: Int,
        newContentBlock: NewContentBlock,
    )

    fun delete(id: Int)

    fun get(id: Int): ContentBlock?
}
