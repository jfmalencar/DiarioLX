package pt.ipl.diariolx.http.auth

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.method.HandlerMethod
import pt.ipl.diariolx.http.problems.ProblemDetail

inline fun <reified A : Annotation> HandlerMethod.hasMethodOrClassAnnotation(): Boolean = findMethodOrClassAnnotation<A>() != null

inline fun <reified A : Annotation> HandlerMethod.findMethodOrClassAnnotation(): A? =
    getMethodAnnotation(A::class.java)
        ?: beanType.getAnnotation(A::class.java)

fun HttpServletResponse.sendProblem(
    objectMapper: ObjectMapper,
    problem: ProblemDetail,
) {
    status = problem.status
    contentType = "application/problem+json"
    writer.write(objectMapper.writeValueAsString(problem))
    writer.flush()
}
