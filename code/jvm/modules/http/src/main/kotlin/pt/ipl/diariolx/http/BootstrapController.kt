package pt.ipl.diariolx.http

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.http.dto.bootstrap.ApiEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.AppBootstrapDTO
import pt.ipl.diariolx.http.dto.bootstrap.AuthEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.CategoryEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.ContentEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.InviteEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.LinkDTO
import pt.ipl.diariolx.http.dto.bootstrap.MediaEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.TagEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.UserEndpointsDTO

@RestController
class BootstrapController {
    @GetMapping(Uris.HOME)
    fun bootstrap(): AppBootstrapDTO =
        AppBootstrapDTO(
            version = "0.0.1",
            api =
                ApiEndpointsDTO(
                    auth =
                        AuthEndpointsDTO(
                            LinkDTO(Uris.Auth.SIGNUP, HttpMethod.POST),
                            LinkDTO(Uris.Auth.LOGIN, HttpMethod.POST),
                            LinkDTO(Uris.Auth.LOGOUT, HttpMethod.POST),
                            LinkDTO(Uris.Auth.REFRESH, HttpMethod.POST),
                        ),
                    users =
                        UserEndpointsDTO(
                            me = LinkDTO(Uris.Users.HOME, HttpMethod.GET),
                            list = LinkDTO(Uris.Users.GET_ALL, HttpMethod.GET),
                            get = LinkDTO(Uris.Users.GET_BY_ID, HttpMethod.GET),
                            create = LinkDTO(Uris.Users.CREATE, HttpMethod.POST),
                            update = LinkDTO(Uris.Users.UPDATE, HttpMethod.PUT),
                            delete = LinkDTO(Uris.Users.DELETE, HttpMethod.DELETE),
                        ),
                    tags =
                        TagEndpointsDTO(
                            list = LinkDTO(Uris.Tags.GET_ALL, HttpMethod.GET),
                            get = LinkDTO(Uris.Tags.GET_BY_ID, HttpMethod.GET),
                            create = LinkDTO(Uris.Tags.CREATE, HttpMethod.POST),
                            update = LinkDTO(Uris.Tags.UPDATE, HttpMethod.PUT),
                            delete = LinkDTO(Uris.Tags.DELETE, HttpMethod.DELETE),
                            archive = LinkDTO(Uris.Tags.ARCHIVE, HttpMethod.POST),
                            unarchive = LinkDTO(Uris.Tags.UNARCHIVE, HttpMethod.POST),
                        ),
                    categories =
                        CategoryEndpointsDTO(
                            list = LinkDTO(Uris.Categories.GET_ALL, HttpMethod.GET),
                            get = LinkDTO(Uris.Categories.GET_BY_ID, HttpMethod.GET),
                            create = LinkDTO(Uris.Categories.CREATE, HttpMethod.POST),
                            update = LinkDTO(Uris.Categories.UPDATE, HttpMethod.PUT),
                            delete = LinkDTO(Uris.Categories.DELETE, HttpMethod.DELETE),
                            archive = LinkDTO(Uris.Categories.ARCHIVE, HttpMethod.POST),
                            unarchive = LinkDTO(Uris.Categories.UNARCHIVE, HttpMethod.POST),
                        ),
                    medias =
                        MediaEndpointsDTO(
                            list = LinkDTO(Uris.Media.GET_ALL, HttpMethod.GET),
                            signedUrl = LinkDTO(Uris.Media.GET_SIGNED_URL, HttpMethod.POST),
                            userSignedUrl = LinkDTO(Uris.Media.GET_USER_SIGNED_URL, HttpMethod.POST),
                            completeUpload = LinkDTO(Uris.Media.COMPLETE_UPLOAD, HttpMethod.POST),
                        ),
                    invites =
                        InviteEndpointsDTO(
                            list = LinkDTO(Uris.Invites.GET_ALL, HttpMethod.GET),
                            create = LinkDTO(Uris.Invites.CREATE, HttpMethod.POST),
                        ),
                    contents =
                        ContentEndpointsDTO(
                            list = LinkDTO(Uris.Content.GET_ALL, HttpMethod.GET),
                            get = LinkDTO(Uris.Content.GET_BY_SLUG, HttpMethod.GET),
                            create = LinkDTO(Uris.Content.CREATE, HttpMethod.POST),
                        ),
                ),
        )
}
