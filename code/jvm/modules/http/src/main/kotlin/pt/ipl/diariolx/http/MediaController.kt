package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import pt.ipl.diariolx.domain.media.Credit
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.RequireRole
import pt.ipl.diariolx.http.dto.media.MediaResponseDTO
import pt.ipl.diariolx.http.dto.media.SignedUrlRequestDTO
import pt.ipl.diariolx.http.dto.media.UploadCompleteResponseDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.services.MediaService
import pt.ipl.diariolx.utils.Success

@RestController
@Tag(name = "Medias", description = "APIs for managing medias")
class MediaController(
    private val mediaService: MediaService,
) {
    @RequireRole(UserRole.CONTRIBUTOR)
    @GetMapping(Uris.Media.GET_ALL)
    fun getAllFiles(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam type: String? = null,
    ): ResponseEntity<*> {
        val response = mediaService.getAll(page, size, type)
        return ResponseEntity.ok().body(
            PaginatedResponseDTO(
                response.items.map { MediaResponseDTO.from(it) },
                Pagination(
                    response.page,
                    response.pageSize,
                    response.hasPrevious,
                    response.hasNext,
                ),
            ),
        )
    }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PostMapping(Uris.Media.UPLOAD)
    fun upload(
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<UploadCompleteResponseDTO> {
        val storedFile =
            mediaService.execute(
                bytes = file.bytes,
                originalFileName = file.originalFilename ?: "file",
                contentType = file.contentType ?: "application/octet-stream",
            )

        return ResponseEntity.ok(
            UploadCompleteResponseDTO(
                objectName = storedFile.objectName,
                url = storedFile.url,
            ),
        )
    }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PostMapping(Uris.Media.GET_SIGNED_URL)
    fun getSignedUrl(
        @RequestBody body: SignedUrlRequestDTO,
    ): ResponseEntity<*> {
        val response =
            mediaService.getSignedUrl(
                altText = body.altText,
                credits = body.credits.map { Credit(it.userId, it.role) },
                contentType = body.contentType,
                originalFileName = body.originalFileName,
                uploadType = body.uploadType,
            )
        if (response is Success) {
            return ResponseEntity.ok(response.value)
        }
        return ResponseEntity.badRequest().build<Unit>()
    }

    @RequireRole(UserRole.CONTRIBUTOR)
    @PostMapping(Uris.Media.COMPLETE_UPLOAD)
    fun completeUpload(
        @PathVariable id: Int,
    ): ResponseEntity<*> {
        mediaService.completeUpload(id)
        return ResponseEntity.ok().build<Unit>()
    }
}
