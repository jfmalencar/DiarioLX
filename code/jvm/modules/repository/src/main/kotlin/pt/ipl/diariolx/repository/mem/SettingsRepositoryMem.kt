package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.repository.SettingsRepository

class SettingsRepositoryMem : SettingsRepository {
    private val store = mutableMapOf<String, String>()

    override fun getAll(): Map<String, String> = store.toMap()

    override fun upsert(
        key: String,
        value: String,
    ) {
        store[key] = value
    }
}
