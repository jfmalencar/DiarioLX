package pt.ipl.diariolx.domain.media

enum class CreditRole(
    val label: String,
    val mediaTypes: Set<MediaType>,
) {
    PHOTOGRAPHER(
        "Fotógrafo",
        setOf(MediaType.IMAGE),
    ),

    VIDEOGRAPHER(
        "Videógrafo",
        setOf(MediaType.VIDEO),
    ),

    AUDIO_ENGINEER(
        "Engenheiro de Som",
        setOf(MediaType.AUDIO),
    ),

    WRITER(
        "Autor",
        setOf(
            MediaType.IMAGE,
            MediaType.VIDEO,
            MediaType.AUDIO,
        ),
    ),

    DIRECTOR(
        "Diretor",
        setOf(MediaType.VIDEO),
    ),

    PRODUCER(
        "Produtor",
        setOf(
            MediaType.VIDEO,
            MediaType.AUDIO,
        ),
    ),

    EDITOR(
        "Editor",
        setOf(
            MediaType.IMAGE,
            MediaType.VIDEO,
            MediaType.AUDIO,
        ),
    ),

    NARRATOR(
        "Narrador",
        setOf(
            MediaType.VIDEO,
            MediaType.AUDIO,
        ),
    ),

    ACTOR(
        "Ator",
        setOf(
            MediaType.VIDEO,
            MediaType.AUDIO,
        ),
    ),

    MODEL(
        "Modelo",
        setOf(
            MediaType.IMAGE,
            MediaType.VIDEO,
        ),
    ),

    ILLUSTRATOR(
        "Ilustrador",
        setOf(MediaType.IMAGE),
    ),

    DESIGNER(
        "Designer",
        setOf(MediaType.IMAGE),
    ),

    OTHER(
        "Outro",
        setOf(
            MediaType.IMAGE,
            MediaType.VIDEO,
            MediaType.AUDIO,
        ),
    ),
}
