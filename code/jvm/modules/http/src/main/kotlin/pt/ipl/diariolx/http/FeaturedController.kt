package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBadRequest
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnHomepageOk
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnNotFound
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.featured.BackofficeHomepageResponseDTO
import pt.ipl.diariolx.http.dto.featured.SaveHomepageRequestDTO
import pt.ipl.diariolx.http.problems.Problem
import pt.ipl.diariolx.http.problems.toProblem
import pt.ipl.diariolx.services.FeaturedService
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Homepage", description = "APIs for managing the homepage featured sections")
class FeaturedController(
    private val featuredService: FeaturedService,
) {
    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Featured.HOMEPAGE)
    @MayReturnHomepageOk
    @MayReturnUnauthorized
    fun getHomepage(): ResponseEntity<*> {
        val sections = featuredService.getHomepage()
        return ResponseEntity.ok(BackofficeHomepageResponseDTO.from(sections))
    }

    @RequireRole(UserRole.ADMIN)
    @PutMapping(Uris.Featured.HOMEPAGE)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnBadRequest
    @MayReturnNotFound
    @MayReturnNoContent
    fun saveHomepage(
        @RequestBody body: SaveHomepageRequestDTO,
    ): ResponseEntity<*> =
        when (val res = featuredService.saveHomepage(body.toInputs())) {
            is Success -> ResponseEntity.noContent().build<Unit>()
            is Failure ->
                Problem.response(
                    res.value.toProblem(),
                    Uris.Guest.HOMEPAGE,
                )
        }
}
