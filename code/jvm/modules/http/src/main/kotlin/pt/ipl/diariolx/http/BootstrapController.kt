package pt.ipl.diariolx.http

import io.swagger.v3.oas.annotations.Parameter
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.featured.SectionPolicy
import pt.ipl.diariolx.domain.featured.SectionType
import pt.ipl.diariolx.domain.media.CreditRole
import pt.ipl.diariolx.domain.media.MediaBaseUrl
import pt.ipl.diariolx.domain.users.UserRole
import pt.ipl.diariolx.http.annotations.MayReturnBootstrapOk
import pt.ipl.diariolx.http.dto.bootstrap.ApiEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.AppBootstrapDTO
import pt.ipl.diariolx.http.dto.bootstrap.AssetsDTO
import pt.ipl.diariolx.http.dto.bootstrap.AuthEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.BackofficeEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.CategoryEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.ContentEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.CreditRolesDTO
import pt.ipl.diariolx.http.dto.bootstrap.FeaturedEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.GuestEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.InviteEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.LinkDTO
import pt.ipl.diariolx.http.dto.bootstrap.MediaEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.SectionTypeConfigDTO
import pt.ipl.diariolx.http.dto.bootstrap.SettingsBootstrapDTO
import pt.ipl.diariolx.http.dto.bootstrap.SettingsEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.TagEndpointsDTO
import pt.ipl.diariolx.http.dto.bootstrap.UserEndpointsDTO
import pt.ipl.diariolx.services.SettingsService

@RestController
class BootstrapController(
    private val mediaBaseUrl: MediaBaseUrl,
    private val settingsService: SettingsService,
    private val sectionPolicy: SectionPolicy,
) {
    @GetMapping(Uris.HOME)
    @MayReturnBootstrapOk
    fun bootstrap(
        @Parameter(hidden = true) role: UserRole?,
    ): AppBootstrapDTO =
        AppBootstrapDTO(
            version = "0.0.1",
            assets =
                AssetsDTO(mediaBaseUrl.imageBaseUrl),
            api =
                ApiEndpointsDTO(
                    auth =
                        AuthEndpointsDTO(
                            LinkDTO(Uris.Auth.SIGNUP, HttpMethod.POST),
                            LinkDTO(Uris.Auth.LOGIN, HttpMethod.POST),
                            LinkDTO(Uris.Auth.LOGOUT, HttpMethod.POST),
                            LinkDTO(Uris.Auth.REFRESH, HttpMethod.POST),
                            LinkDTO(Uris.Auth.USER, HttpMethod.GET),
                        ),
                    guest =
                        GuestEndpointsDTO(
                            homepage = LinkDTO(Uris.Guest.HOMEPAGE, HttpMethod.GET),
                            listContent = LinkDTO(Uris.Guest.LIST_CONTENT, HttpMethod.GET),
                            getContent = LinkDTO(Uris.Guest.GET_CONTENT, HttpMethod.GET),
                            team = LinkDTO(Uris.Guest.TEAM, HttpMethod.GET),
                            author = LinkDTO(Uris.Guest.AUTHOR, HttpMethod.GET),
                            tag = LinkDTO(Uris.Guest.TAG, HttpMethod.GET),
                            category = LinkDTO(Uris.Guest.CATEGORY, HttpMethod.GET),
                        ),
                    backoffice =
                        role?.let {
                            BackofficeEndpointsDTO(
                                users =
                                    UserEndpointsDTO(
                                        list = LinkDTO(Uris.Users.GET_ALL, HttpMethod.GET),
                                        get = LinkDTO(Uris.Users.GET_BY_ID, HttpMethod.GET),
                                        create = LinkDTO(Uris.Users.CREATE, HttpMethod.POST),
                                        update = LinkDTO(Uris.Auth.USER, HttpMethod.PUT),
                                        delete = LinkDTO(Uris.Users.DELETE, HttpMethod.DELETE),
                                        deactivate = LinkDTO(Uris.Users.DEACTIVATE, HttpMethod.POST),
                                        avatar = LinkDTO(Uris.Auth.USER_AVATAR, HttpMethod.PATCH),
                                        setTeam = LinkDTO(Uris.Users.SET_TEAM, HttpMethod.PATCH),
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
                                        completeUpload = LinkDTO(Uris.Media.COMPLETE_UPLOAD, HttpMethod.POST),
                                    ),
                                invites =
                                    InviteEndpointsDTO(
                                        list = LinkDTO(Uris.Invites.GET_ALL, HttpMethod.GET),
                                        create = LinkDTO(Uris.Invites.CREATE, HttpMethod.POST),
                                        delete = LinkDTO(Uris.Invites.DELETE, HttpMethod.DELETE),
                                    ),
                                contents =
                                    ContentEndpointsDTO(
                                        internalList = LinkDTO(Uris.Content.INTERNAL_GET_ALL, HttpMethod.GET),
                                        internalGetById = LinkDTO(Uris.Content.CONTENT_BY_ID, HttpMethod.GET),
                                        internalGetHistory = LinkDTO(Uris.Content.INTERNAL_HISTORY_BY_ID, HttpMethod.GET),
                                        create = LinkDTO(Uris.Content.MAIN, HttpMethod.POST),
                                        update = LinkDTO(Uris.Content.MAIN, HttpMethod.PUT),
                                        delete = LinkDTO(Uris.Content.CONTENT_BY_ID, HttpMethod.DELETE),
                                        publish = LinkDTO(Uris.Content.PUBLISH, HttpMethod.POST),
                                        submit = LinkDTO(Uris.Content.SUBMIT, HttpMethod.POST),
                                        reject = LinkDTO(Uris.Content.REJECT, HttpMethod.POST),
                                        archive = LinkDTO(Uris.Content.ARCHIVE, HttpMethod.POST),
                                    ),
                                featured =
                                    FeaturedEndpointsDTO(
                                        get = LinkDTO(Uris.Featured.HOMEPAGE, HttpMethod.GET),
                                        update = LinkDTO(Uris.Featured.HOMEPAGE, HttpMethod.PUT),
                                    ),
                                settings =
                                    SettingsEndpointsDTO(
                                        get = LinkDTO(Uris.Settings.ROOT, HttpMethod.GET),
                                        update = LinkDTO(Uris.Settings.ROOT, HttpMethod.PUT),
                                    ),
                            )
                        },
                ),
            settings =
                SettingsBootstrapDTO.from(
                    settingsService.getAll(),
                    settingsService.getNavigation(),
                ),
            creditRoles =
                CreditRole.entries.map {
                    CreditRolesDTO(
                        value = it,
                        label = it.label,
                        byline = it.byline,
                        mediaTypes = it.mediaTypes.toList(),
                    )
                },
            sections =
                SectionType.entries.map {
                    val rule = sectionPolicy.rule(it)
                    SectionTypeConfigDTO(it.name, rule.maxArticles, rule.canBeAdded, rule.hasCategory)
                },
        )
}
