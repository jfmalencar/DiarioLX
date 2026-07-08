package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.KotlinPlugin
import org.jdbi.v3.core.statement.SqlStatement
import org.jdbi.v3.postgres.PostgresPlugin
import pt.ipl.diariolx.repository.mappers.InstantMapper

fun Jdbi.configureWithAppRequirements(): Jdbi {
    installPlugin(KotlinPlugin())
    installPlugin(PostgresPlugin())

    registerColumnMapper(Instant::class.java, InstantMapper())

    return this
}

fun <T : SqlStatement<T>, E : Enum<E>> T.bindListIfNotNull(
    key: String,
    items: List<E>?,
): T =
    if (!items.isNullOrEmpty()) {
        bindList(key, items.map { it.name })
    } else {
        this
    }
