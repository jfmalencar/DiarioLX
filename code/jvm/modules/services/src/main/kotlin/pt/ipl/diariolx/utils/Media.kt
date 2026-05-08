package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.media.Media
import pt.ipl.diariolx.domain.media.SignedUrlResponse
import pt.ipl.diariolx.domain.media.UserSignedUrlResponse

data class MediaQuery(
    val page: Int = 1,
    val limit: Int = 20,
)

sealed class MediaError(
    val message: String,
) {
    object EmptyName : MediaError("Media name cannot be empty")

    object InvalidSlug : MediaError("Media slug must be unique")

    object SlugAlreadyExists : MediaError("Media slug already exists")

    object MediaNotFound : MediaError("Media not found")
}

typealias MediaResult = Either<MediaError, Media>

typealias MediaSignedUrlResult = Either<MediaError, SignedUrlResponse>

typealias UserMediaSignedUrlResult = Either<MediaError, UserSignedUrlResponse>

typealias MediaCreateResult = Either<MediaError, Int>

typealias MediaValidationResult = Either<MediaError, Unit>
