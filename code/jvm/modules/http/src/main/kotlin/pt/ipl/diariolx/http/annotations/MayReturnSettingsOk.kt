package pt.ipl.diariolx.http.annotations

import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import pt.ipl.diariolx.http.dto.settings.SettingsResponseDTO

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@ApiResponse(
    responseCode = "200",
    content = [Content(schema = Schema(implementation = SettingsResponseDTO::class))],
)
annotation class MayReturnSettingsOk
