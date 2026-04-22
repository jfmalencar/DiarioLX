package pt.ipl.diariolx.http

import com.fasterxml.jackson.annotation.JsonInclude
import org.springframework.http.HttpStatus

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ProblemDetail(
    val type: String,
    val title: String,
    val status: Int,
    val detail: String? = null,
    val instance: String? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val additionalProperties: Map<String, Any>? = null,
)

fun createProblemDetail(
    type: String,
    title: String,
    status: HttpStatus,
    detail: String? = null,
    instance: String? = null,
    additionalProperties: Map<String, Any>? = null,
): ProblemDetail =
    ProblemDetail(
        type = type,
        title = title,
        status = status.value(),
        detail = detail,
        instance = instance,
        additionalProperties = additionalProperties,
    )
