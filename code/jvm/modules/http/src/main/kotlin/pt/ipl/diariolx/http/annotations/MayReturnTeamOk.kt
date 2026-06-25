package pt.ipl.diariolx.http.annotations

import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import pt.ipl.diariolx.http.dto.user.TeamMemberResponseDTO

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@ApiResponse(
    responseCode = "200",
    content = [Content(array = ArraySchema(schema = Schema(implementation = TeamMemberResponseDTO::class)))],
)
annotation class MayReturnTeamOk
