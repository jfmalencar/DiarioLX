package pt.ipl.diariolx.domain.settings

/**
 * Site-wide settings as presented to administrators: the generic key/value pairs plus the
 * ordered slugs of the categories highlighted in the public navigation bar, which are held
 * in their own table rather than in the key/value store.
 */
data class SettingsView(
    val values: Map<String, String>,
    val featuredCategorySlugs: List<String>,
)
