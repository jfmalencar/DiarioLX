package pt.ipl.diariolx.http

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.http.dto.media.MediaResponseDTO
import pt.ipl.diariolx.http.dto.media.SignedUrlRequestDTO
import pt.ipl.diariolx.http.dto.media.UploadCompleteResponseDTO
import pt.ipl.diariolx.http.dto.media.UserSignedUrlRequestDTO
import pt.ipl.diariolx.http.dto.pagination.PaginatedResponseDTO
import pt.ipl.diariolx.http.dto.pagination.Pagination
import pt.ipl.diariolx.services.FileService
import pt.ipl.diariolx.utils.Success

@RestController
class FileController(
    private val fileService: FileService,
) {
    @GetMapping(Uris.Files.GET_ALL)
    fun getAllFiles(
        @RequestParam page: Int = 1,
        @RequestParam size: Int = 10,
        @RequestParam type: String? = null,
    ): ResponseEntity<*> {
        val response = fileService.getAll(page, size, type)
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

    @PostMapping(Uris.Files.UPLOAD)
    fun upload(
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<UploadCompleteResponseDTO> {
        val storedFile =
            fileService.execute(
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

    @PostMapping(Uris.Files.GET_SIGNED_URL)
    fun getSignedUrl(
        @RequestBody body: SignedUrlRequestDTO,
    ): ResponseEntity<*> {
        val response =
            fileService.getSignedUrl(
                body.altText,
                body.photographerId,
                body.contentType,
                body.originalFileName,
            )
        if (response is Success) {
            return ResponseEntity.ok(response.value)
        }
        return ResponseEntity.badRequest().build<Unit>()
    }

    @PostMapping(Uris.Files.GET_USER_SIGNED_URL)
    fun getUserSignedUrl(
        authenticatedUser: AuthenticatedUser,
        @RequestBody body: UserSignedUrlRequestDTO,
    ): ResponseEntity<*> {
        val response =
            fileService.getUserSignedUrl(
                body.contentType,
                authenticatedUser.user.id,
            )
        if (response is Success) {
            return ResponseEntity.ok(response.value)
        }
        return ResponseEntity.badRequest().build<Unit>()
    }

    @PostMapping(Uris.Files.COMPLETE_UPLOAD)
    fun completeUpload(
        @PathVariable id: Int,
    ): ResponseEntity<*> {
        fileService.completeUpload(id)
        return ResponseEntity.ok().build<Unit>()
    }
}
