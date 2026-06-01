package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.SignedUrl

sealed class MediaError(
    val message: String,
) {
    object EmptyName : MediaError("Media name cannot be empty")

    object InvalidSlug : MediaError("Media slug must be unique")

    object SlugAlreadyExists : MediaError("Media slug already exists")

    object MediaNotFound : MediaError("Media not found")
}

typealias MediaResult = Either<MediaError, Media>

typealias MediaSignedUrlResult = Either<MediaError, SignedUrl>

typealias MediaCreateResult = Either<MediaError, Int>

typealias MediaValidationResult = Either<MediaError, Unit>
