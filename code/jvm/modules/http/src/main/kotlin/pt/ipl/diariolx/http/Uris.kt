package pt.ipl.diariolx.http

import org.springframework.web.util.UriTemplate
import java.net.URI

object Uris {
    const val PREFIX = "/api"
    const val HOME = PREFIX
    const val BACKOFFICE = "$PREFIX/backoffice"

    fun home(): URI = URI(HOME)

    object Users {
        const val ROOT = "$BACKOFFICE/users"

        const val CREATE = ROOT
        const val GET_ALL = ROOT
        const val GET_BY_ID = "$ROOT/{id}"
        const val DELETE = "$ROOT/{id}"
        const val MANAGE_STATUS = "$ROOT/{id}/account-status"
        const val SET_TEAM = "$ROOT/{id}/team"

        fun byId(id: Int): URI = UriTemplate(GET_BY_ID).expand(id)
    }

    object Invites {
        const val ROOT = "$BACKOFFICE/invites"

        const val CREATE = ROOT
        const val GET_ALL = ROOT
        const val DELETE = "$ROOT/{id}"
    }

    object Auth {
        const val ROOT = "$PREFIX/auth"

        const val SIGNUP = "$ROOT/signup"
        const val LOGIN = "$ROOT/login"
        const val LOGOUT = "$ROOT/logout"
        const val REFRESH = "$ROOT/refresh"
        const val USER = "$ROOT/me"
        const val USER_AVATAR = "${Users.ROOT}/me/avatar"
    }

    object Categories {
        const val ROOT = "$BACKOFFICE/categories"

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
        const val ROOT = "$BACKOFFICE/tags"

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
        const val ROOT = "$BACKOFFICE/medias"

        const val UPLOAD = ROOT
        const val GET_ALL = ROOT
        const val GET_SIGNED_URL = "$ROOT/signed-url"
        const val COMPLETE_UPLOAD = "$ROOT/{id}"
    }

    object Content {
        const val ROOT = "$BACKOFFICE/contents"

        const val MAIN = ROOT
        const val ARCHIVE = "$ROOT/{id}/archive"
        const val PUBLISH = "$ROOT/{id}/publish"
        const val SUBMIT = "$ROOT/{id}/submit"
        const val REJECT = "$ROOT/{id}/reject"
        const val CONTENT_BY_ID = "$ROOT/{id}"
        const val INTERNAL_GET_ALL = ROOT
        const val INTERNAL_HISTORY_BY_ID = "$ROOT/{id}/history"
    }

    object Featured {
        const val ROOT = "$BACKOFFICE/featured"
        const val HOMEPAGE = "$ROOT/homepage"
    }

    object Settings {
        const val ROOT = "$BACKOFFICE/settings"
    }

    object Guest {
        const val HOMEPAGE = "$PREFIX/homepage"
        const val NAVIGATION = "$PREFIX/navigation"
        const val LIST_CONTENT = "$PREFIX/contents"
        const val GET_CONTENT = "$PREFIX/contents/{slug}"
        const val TEAM = "$PREFIX/team"
        const val AUTHOR = "$PREFIX/authors/{slug}"
        const val TAG = "$PREFIX/tags/{slug}"
        const val CATEGORY = "$PREFIX/categories/{slug}"
    }
}
