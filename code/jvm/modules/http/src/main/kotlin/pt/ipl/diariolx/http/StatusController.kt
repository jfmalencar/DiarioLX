package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.net.InetAddress

@RestController
@Tag(name = "Status", description = "APIs for checking status")
class StatusController {
    @GetMapping(Uris.Status.HOSTNAME)
    fun getStatusHostname(): String = System.getenv("HOSTNAME")

    @GetMapping(Uris.Status.IP)
    fun getStatusIp(): String = InetAddress.getLocalHost().hostAddress
}
