package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnForbidden
import pt.ipl.diariolx.http.annotations.MayReturnNoContent
import pt.ipl.diariolx.http.annotations.MayReturnUnauthorized
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.settings.SettingsRequestDTO
import pt.ipl.diariolx.http.dto.settings.SettingsResponseDTO
import pt.ipl.diariolx.services.SettingsService

@RestController
@Tag(name = "Settings", description = "APIs for managing site-wide settings (social links, contact, navigation)")
class SettingsController(
    private val settingsService: SettingsService,
) {
    @RequireRole(UserRole.ADMIN)
    @GetMapping(Uris.Settings.ROOT)
    @MayReturnUnauthorized
    @MayReturnForbidden
    fun getSettings(): ResponseEntity<*> = ResponseEntity.ok(SettingsResponseDTO.from(settingsService.getAll()))

    @RequireRole(UserRole.ADMIN)
    @PutMapping(Uris.Settings.ROOT)
    @MayReturnUnauthorized
    @MayReturnForbidden
    @MayReturnNoContent
    fun updateSettings(
        @RequestBody body: SettingsRequestDTO,
    ): ResponseEntity<*> {
        settingsService.update(body.toMap())
        return ResponseEntity.noContent().build<Unit>()
    }
}
