package pt.ipl.diariolx.http

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import pt.ipl.diariolx.http.model.FileResponse
import pt.ipl.diariolx.http.model.MediaResponse
import pt.ipl.diariolx.http.model.SignedUrlRequest
import pt.ipl.diariolx.services.FileService
import pt.ipl.diariolx.utils.Success

@RestController
class FileController(
    private val fileService: FileService,
) {
    @GetMapping(Uris.Files.GET_ALL)
    fun getAllFiles(
        @RequestParam page: Int = 1,
        @RequestParam limit: Int = 10,
    ): ResponseEntity<*> {
        val limit = if (limit > 30) 30 else limit
        val medias = fileService.getAll(page, limit).map { MediaResponse.from(it) }
        return ResponseEntity.ok(mapOf("medias" to medias))
    }

    @PostMapping(Uris.Files.UPLOAD)
    fun upload(
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<FileResponse> {
        val storedFile =
            fileService.execute(
                bytes = file.bytes,
                originalFileName = file.originalFilename ?: "file",
                contentType = file.contentType ?: "application/octet-stream",
            )

        return ResponseEntity.ok(
            FileResponse(
                objectName = storedFile.objectName,
                url = storedFile.url,
            ),
        )
    }

    @PostMapping(Uris.Files.GET_SIGNED_URL)
    fun getSignedUrl(
        @RequestBody body: SignedUrlRequest,
    ): ResponseEntity<*> {
        println(body)
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

    @PostMapping(Uris.Files.COMPLETE_UPLOAD)
    fun completeUpload(
        @PathVariable id: Int,
    ): ResponseEntity<*> {
        fileService.completeUpload(id)
        return ResponseEntity.ok().build<Unit>()
    }
}
