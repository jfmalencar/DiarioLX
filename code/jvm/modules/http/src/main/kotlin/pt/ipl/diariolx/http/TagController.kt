package pt.ipl.diariolx.http

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.http.model.TagRequest
import pt.ipl.diariolx.services.TagService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
class TagController(
    private val tagService: TagService,
) {
    @GetMapping(Uris.Tags.GET_BY_ID)
    fun getTagById(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (val result = tagService.get(id)) {
            is Success -> ResponseEntity.ok(mapOf("tag" to result.value))
            is Failure -> ResponseEntity.notFound().build<Unit>()
        }
    }

    @GetMapping(Uris.Tags.GET_ALL)
    fun getAllTags(
        @RequestParam page: Int = 1,
        @RequestParam limit: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<*> {
        val limit = if (limit > 30) 30 else limit
        val tags = tagService.getAll(page, limit, query, archived)
        return ResponseEntity.ok(mapOf("tags" to tags))
    }

    @PostMapping(Uris.Tags.CREATE)
    fun createTag(
        @RequestBody body: TagRequest,
    ): ResponseEntity<*> =
        when (val res = tagService.create(body.name, body.slug, body.description)) {
            is Success ->
                ResponseEntity
                    .status(201)
                    .header(
                        "Location",
                        Uris.Tags.byId(res.value).toASCIIString(),
                    ).build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }

    @PutMapping(Uris.Tags.UPDATE)
    fun updateTag(
        @PathVariable id: String,
        @RequestBody body: TagRequest,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.update(id, body.name, body.slug, body.description)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @DeleteMapping(Uris.Tags.DELETE)
    fun deleteTag(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.delete(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @PostMapping(Uris.Tags.ARCHIVE)
    fun archiveTag(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.archive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @PostMapping(Uris.Tags.UNARCHIVE)
    fun unarchiveTag(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (tagService.unarchive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }
}
