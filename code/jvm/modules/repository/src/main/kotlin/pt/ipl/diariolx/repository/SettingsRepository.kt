package pt.ipl.diariolx.repository

interface SettingsRepository {
    fun getAll(): Map<String, String>

    fun upsert(
        key: String,
        value: String,
    )
}
