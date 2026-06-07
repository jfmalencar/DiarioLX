package pt.ipl.diariolx.http

import org.springframework.web.util.UriTemplate
import java.net.URI

object Uris {
    const val PREFIX = "/api"
    const val HOME = PREFIX

    fun home(): URI = URI(HOME)

    object Users {
        const val ROOT = "$PREFIX/users"

        const val CREATE = ROOT
        const val GET_ALL = ROOT
        const val GET_BY_ID = "$ROOT/{id}"
        const val DELETE = "$ROOT/{id}"
        const val UPDATE = "$ROOT/me"
        const val DEACTIVATE = "$ROOT/{id}/deactivate"
        const val AVATAR = "$ROOT/me/avatar"

        const val HOME = "$ROOT/me"

        fun byId(id: Int): URI = UriTemplate(GET_BY_ID).expand(id)
    }

    object Invites {
        const val ROOT = "$PREFIX/invites"

        const val CREATE = ROOT
        const val GET_ALL = ROOT
        const val GET_BY_ID = "$ROOT/{id}"
    }

    object Auth {
        const val ROOT = "$PREFIX/auth"

        const val SIGNUP = "$ROOT/signup"
        const val LOGIN = "$ROOT/login"
        const val LOGOUT = "$ROOT/logout"
        const val REFRESH = "$ROOT/refresh"
    }

    object Categories {
        const val ROOT = "$PREFIX/categories"

        const val GET_BY_ID = "$ROOT/{id}"
        const val CREATE = ROOT
        const val UPDATE = "$ROOT/{id}"
        const val DELETE = "$ROOT/{id}"
        const val GET_ALL = ROOT
        const val ARCHIVE = "$ROOT/{id}/archive"
        const val UNARCHIVE = "$ROOT/{id}/unarchive"

        fun byId(id: Int): URI = UriTemplate(GET_BY_ID).expand(id)
    }

    object Tags {
        const val ROOT = "$PREFIX/tags"

        const val GET_BY_ID = "$ROOT/{id}"
        const val CREATE = ROOT
        const val UPDATE = "$ROOT/{id}"
        const val DELETE = "$ROOT/{id}"
        const val GET_ALL = ROOT
        const val ARCHIVE = "$ROOT/{id}/archive"
        const val UNARCHIVE = "$ROOT/{id}/unarchive"

        fun byId(id: Int): URI = UriTemplate(GET_BY_ID).expand(id)
    }

    object Status {
        const val HOSTNAME = "$PREFIX/status/hostname"
        const val IP = "$PREFIX/status/ip"
    }

    object Media {
        const val UPLOAD = "$PREFIX/medias"
        const val GET_ALL = "$PREFIX/medias"
        const val GET_SIGNED_URL = "$PREFIX/medias/signed-url"
        const val GET_USER_SIGNED_URL = "$PREFIX/medias/user-signed-url"
        const val COMPLETE_UPLOAD = "$PREFIX/medias/{id}"
        const val COMPLETE_AVATAR_UPLOAD = "$PREFIX/medias/me"
    }

    object Content {
        const val MAIN = "$PREFIX/contents"
        const val ARCHIVE = "$PREFIX/contents/archive/{id}"
        const val PUBLISH = "$PREFIX/contents/publish"
        const val REJECT = "$PREFIX/contents/reject"
        const val CONTENT_BY_ID = "$PREFIX/contents/{id}"
        const val CONTENT_BY_SLUG = "$PREFIX/contents/{slug}"
        const val GET_ALL = "$PREFIX/contents"
        const val INTERNAL_CONTENT_BY_ID = "$PREFIX/internal-contents/{id}"
        const val INTERNAL_CONTENT_BY_SLUG = "$PREFIX/internal-contents/{slug}"
        const val INTERNAL_GET_ALL = "$PREFIX/internal-contents"
    }

    object Public {
        const val HOMEPAGE = "$PREFIX/homepage"
        const val NAVIGATION = "$PREFIX/navigation"
    }
}
