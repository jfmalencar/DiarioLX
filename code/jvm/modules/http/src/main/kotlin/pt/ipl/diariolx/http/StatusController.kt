package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.http.annotations.MayReturnOk
import java.net.InetAddress

@RestController
@Tag(name = "Status", description = "APIs for checking status")
class StatusController {
    @GetMapping(Uris.Status.HOSTNAME)
    @MayReturnOk
    fun getStatusHostname(): String = System.getenv("HOSTNAME")

    @GetMapping(Uris.Status.IP)
    @MayReturnOk
    fun getStatusIp(): String = InetAddress.getLocalHost().hostAddress
}
