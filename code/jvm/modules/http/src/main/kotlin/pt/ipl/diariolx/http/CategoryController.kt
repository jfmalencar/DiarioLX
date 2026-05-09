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
import pt.ipl.diariolx.http.model.CategoryRequestDTO
import pt.ipl.diariolx.http.model.CategoryResponseDTO
import pt.ipl.diariolx.services.CategoryService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
class CategoryController(
    private val categoryService: CategoryService,
) {
    @GetMapping(Uris.Categories.GET_BY_ID)
    fun getCategoryById(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (val result = categoryService.get(id)) {
            is Success -> ResponseEntity.ok(mapOf("category" to CategoryResponseDTO.from(result.value)))
            is Failure -> ResponseEntity.notFound().build<Unit>()
        }
    }

    @GetMapping(Uris.Categories.GET_ALL)
    fun getAllCategories(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<*> {
        val size = if (size > 30) 30 else size
        val response = categoryService.getAll(page, size, query, archived)
        return ResponseEntity.ok().body(
            mapOf(
                "categories" to response.items.map { CategoryResponseDTO.from(it) },
                "pagination" to
                    mapOf(
                        "hasPrevious" to response.hasPrevious,
                        "hasNext" to response.hasNext,
                        "page" to response.page,
                        "size" to response.pageSize,
                    ),
            ),
        )
    }

    @PostMapping(Uris.Categories.CREATE)
    fun createCategory(
        @RequestBody body: CategoryRequestDTO,
    ): ResponseEntity<*> =
        when (val res = categoryService.create(body.name, body.slug, body.description, body.color, body.parentId)) {
            is Success ->
                ResponseEntity
                    .status(201)
                    .header(
                        "Location",
                        Uris.Categories.byId(res.value).toASCIIString(),
                    ).build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }

    @PutMapping(Uris.Categories.UPDATE)
    fun updateCategory(
        @PathVariable id: String,
        @RequestBody body: CategoryRequestDTO,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (categoryService.update(id, body.name, body.slug, body.description, body.color, body.parentId)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @DeleteMapping(Uris.Categories.DELETE)
    fun deleteCategory(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (categoryService.delete(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @PostMapping(Uris.Categories.ARCHIVE)
    fun archiveCategory(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (categoryService.archive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }

    @PostMapping(Uris.Categories.UNARCHIVE)
    fun unarchiveCategory(
        @PathVariable id: String,
    ): ResponseEntity<*> {
        val id = id.toInt()
        return when (categoryService.unarchive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure -> ResponseEntity.badRequest().build<Unit>()
        }
    }
}
