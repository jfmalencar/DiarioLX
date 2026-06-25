package pt.ipl.diariolx.domain.media

enum class CreditRole(
    val label: String,
    val byline: String,
    val mediaTypes: Set<MediaType>,
) {
    PHOTOGRAPHER("Fotógrafo", "Fotografia", setOf(MediaType.IMAGE)),

    VIDEOGRAPHER("Videógrafo", "Vídeo", setOf(MediaType.VIDEO)),

    AUDIO_ENGINEER("Engenheiro de Som", "Som", setOf(MediaType.AUDIO)),

    WRITER(
        "Autor",
        "Texto",
        setOf(MediaType.IMAGE, MediaType.VIDEO, MediaType.AUDIO),
    ),

    DIRECTOR("Diretor", "Realização", setOf(MediaType.VIDEO)),

    PRODUCER("Produtor", "Produção", setOf(MediaType.VIDEO, MediaType.AUDIO)),

    EDITOR(
        "Editor",
        "Edição",
        setOf(MediaType.IMAGE, MediaType.VIDEO, MediaType.AUDIO),
    ),

    NARRATOR("Narrador", "Narração", setOf(MediaType.VIDEO, MediaType.AUDIO)),

    ACTOR("Ator", "Interpretação", setOf(MediaType.VIDEO, MediaType.AUDIO)),

    MODEL("Modelo", "Modelo", setOf(MediaType.IMAGE, MediaType.VIDEO)),

    ILLUSTRATOR("Ilustrador", "Ilustração", setOf(MediaType.IMAGE)),

    DESIGNER("Designer", "Design", setOf(MediaType.IMAGE)),

    OTHER(
        "Outro",
        "Créditos",
        setOf(MediaType.IMAGE, MediaType.VIDEO, MediaType.AUDIO),
    ),
}
