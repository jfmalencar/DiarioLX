package pt.ipl.diariolx.http.annotations

import pt.ipl.diariolx.domain.users.UserRole

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequireRole(
    val value: UserRole,
)
