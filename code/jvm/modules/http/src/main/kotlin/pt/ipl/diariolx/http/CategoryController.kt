package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnCategoryOk
import pt.ipl.diariolx.http.annotations.MayReturnConflict
import pt.ipl.diariolx.http.annotations.MayReturnCreated
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnPaginationOk
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.dto.category.CategoryResponseDTO
import pt.ipl.diariolx.http.dto.category.CreateUpdateCategoryRequestDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.CategoryService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Categories", description = "APIs for managing categories")
class CategoryController(
    private val categoryService: CategoryService,
) {
    @GetMapping(Uris.Categories.GET_BY_ID)
    @MayReturnCategoryOk
    @MayReturnUnauthorized
    @MayReturnNotFound
    fun getCategoryById(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val result = categoryService.get(id)) {
            is Success -> ResponseEntity.ok(CategoryResponseDTO.from(result.value))
            is Failure ->
                Problem.response(
                    result.value.toProblem(),
                    Uris.Categories.GET_BY_ID,
                )
        }

    @GetMapping(Uris.Categories.GET_ALL)
    @MayReturnPaginationOk
    @MayReturnUnauthorized
    fun getAllCategories(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam query: String? = null,
        @RequestParam archived: Boolean = false,
    ): ResponseEntity<*> {
        val response = categoryService.getAll(page, size, query, archived)
        return ResponseEntity.ok().body(
            PaginatedResponseDTO(
                response.items.map { CategoryResponseDTO.from(it) },
                Pagination(
                    response.page,
                    response.pageSize,
                    response.hasPrevious,
                    response.hasNext,
                ),
            ),
        )
    }

    @PostMapping(Uris.Categories.CREATE)
    @MayReturnBadRequest
    @MayReturnCreated
    @MayReturnConflict
    fun createCategory(
        @RequestBody body: CreateUpdateCategoryRequestDTO,
    ): ResponseEntity<*> =
        when (val res = categoryService.create(body.name, body.slug, body.description, body.color, body.parentId)) {
            is Success ->
                ResponseEntity
                    .created(Uris.Categories.byId(res.value))
                    .build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Categories.CREATE,
                )
        }

    @PutMapping(Uris.Categories.UPDATE)
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    @MayReturnConflict
    fun updateCategory(
        @PathVariable id: Int,
        @RequestBody body: CreateUpdateCategoryRequestDTO,
    ): ResponseEntity<*> =
        when (val res = categoryService.update(id, body.name, body.slug, body.description, body.color, body.parentId)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Categories.UPDATE,
                )
        }

    @DeleteMapping(Uris.Categories.DELETE)
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    fun deleteCategory(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val res = categoryService.delete(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Categories.UPDATE,
                )
        }

    @PostMapping(Uris.Categories.ARCHIVE)
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    fun archiveCategory(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val res = categoryService.archive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Categories.ARCHIVE,
                )
        }

    @PostMapping(Uris.Categories.UNARCHIVE)
    @MayReturnNotFound
    @MayReturnBadRequest
    @MayReturnNoContent
    fun unarchiveCategory(
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        when (val res = categoryService.unarchive(id)) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Categories.UNARCHIVE,
                )
        }
}
