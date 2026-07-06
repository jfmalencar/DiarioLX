package pt.ipl.diariolx

object Environment {
    fun getDbUrl() =
        "jdbc:postgresql://${System.getenv("POSTGRES_HOST")}:${System.getenv("POSTGRES_PORT")}/${System.getenv(
            "POSTGRES_DB",
        )}?user=${System.getenv("POSTGRES_USER")}&password=${System.getenv("POSTGRES_PASSWORD")}"
}
