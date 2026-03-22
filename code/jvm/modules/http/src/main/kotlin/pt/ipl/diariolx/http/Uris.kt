package pt.ipl.diariolx.http

import org.springframework.web.util.UriTemplate
import java.net.URI

object Uris {
    const val PREFIX = "/api"
    const val HOME = PREFIX

    fun home(): URI = URI(HOME)

    object Users {
        const val CREATE = "$PREFIX/users"
        const val TOKEN = "$PREFIX/users/token"
        const val LOGOUT = "$PREFIX/logout"
        const val GET_BY_ID = "$PREFIX/users/{id}"
        const val HOME = "$PREFIX/me"

        fun byId(id: Int): URI = UriTemplate(GET_BY_ID).expand(id)

        fun login(): URI = URI(TOKEN)

        fun register(): URI = URI(CREATE)
    }

    object Categories {
        const val GET_BY_ID = "$PREFIX/categories/{id}"
        const val CREATE = "$PREFIX/categories"
        const val UPDATE = "$PREFIX/categories/{id}"
        const val DELETE = "$PREFIX/categories/{id}"
        const val GET_ALL = "$PREFIX/categories"

        fun byId(id: Int): URI = UriTemplate(GET_BY_ID).expand(id)
    }

    object Status {
        const val HOSTNAME = "$PREFIX/status/hostname"
        const val IP = "$PREFIX/status/ip"
    }
}
