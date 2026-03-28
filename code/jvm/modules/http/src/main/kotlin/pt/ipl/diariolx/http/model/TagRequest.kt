package pt.ipl.diariolx.http.model

data class TagRequest(
    val name: String,
    val slug: String,
    val description: String? = null,
)
