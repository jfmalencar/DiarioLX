package pt.ipl.diariolx.http

import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pt.ipl.diariolx.domain.invites.Invite
import pt.ipl.diariolx.domain.invites.InviteRole
import pt.ipl.diariolx.domain.users.AuthenticatedUser
import pt.ipl.diariolx.domain.users.OperationOnUser
import pt.ipl.diariolx.domain.users.dto.LoginUserDTO
import pt.ipl.diariolx.domain.users.dto.NewUserDTO
import pt.ipl.diariolx.domain.users.dto.UpdateUserDTO
import pt.ipl.diariolx.services.InviteServices
import pt.ipl.diariolx.services.UserServices
import pt.ipl.diariolx.utils.Either
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.LoginError
import pt.ipl.diariolx.utils.Success
import pt.ipl.diariolx.utils.UserError

@RestController
@RequestMapping("/api/user")
class UserController(
    private val userServices: UserServices,
    private val inviteServices: InviteServices,
    private val logger: Logger,
) {
    @PostMapping(
        "/signup",
    )
    fun createUser(
        invite: Invite,
        @RequestBody body: NewUserDTO,
    ): ResponseEntity<*> {
        logger.info("POST /signup $invite, $body")
        return handleUserOperationResult(
            "/user/signup",
            userServices.create(body.username, body.email, body.password, body.fName, body.lName, invite),
            HttpStatus.CREATED,
        ) {
            logger.info("Invite: ${invite.invite} used to create user with username: ${body.username}")
            mapOf(
                "userId" to it,
            )
        }
    }

    @PostMapping(
        "/update",
    )
    fun updateUser(
        me: AuthenticatedUser,
        @RequestBody body: UpdateUserDTO,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            "/user/update",
            userServices.update(
                me.user,
                body.username,
                body.email,
                body.password,
                body.fName,
                body.lName,
                body.bio,
                body.profilePictureURL,
            ),
            HttpStatus.ACCEPTED,
        ) {
            mapOf(
                "message" to "User updated successfully",
            )
        }

    @GetMapping("/me")
    fun getCurrentUser(me: AuthenticatedUser): ResponseEntity<*> =
        ResponseEntity.ok(
            mapOf(
                "userId" to me.user.id,
                "username" to me.user.username.value,
                "email" to me.user.email.value,
                "fName" to me.user.fName.value,
                "lName" to me.user.lName.value,
                "bio" to me.user.bio,
                "profilePictureURL" to me.user.profilePictureURL,
            ),
        )

    @GetMapping(
        "/{id}",
    )
    fun getUserById(
        me: AuthenticatedUser,
        @PathVariable id: Int,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            "/user/getInfo",
            userServices.get(me.user, id),
        ) {
            mapOf(
                "userId" to it.id,
                "username" to it.username.value,
                "email" to it.email.value,
                "fName" to it.fName.value,
                "lName" to it.lName.value,
                "bio" to it.bio,
                "profilePictureURL" to it.profilePictureURL,
            )
        }

    @GetMapping(
        "/all",
    )
    fun getAllUsers(
        // me: AuthenticatedUser,
        @RequestParam offset: Int = 0,
        @RequestParam limit: Int = 30,
        @RequestParam query: String? = null,
        @RequestParam deactivated: Boolean = false,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            "/user/all",
            userServices.getAll(offset, limit, query, deactivated),
        ) {
            mapOf(
                "users" to
                    it.map { user ->
                        mapOf(
                            "userId" to user.id,
                            "username" to user.username.value,
                            "email" to user.email.value,
                            "fName" to user.fName.value,
                            "lName" to user.lName.value,
                            "bio" to user.bio,
                            "profilePictureURL" to user.profilePictureURL,
                        )
                    },
            )
        }

    @PostMapping("/admin/remove-user")
    fun removeUser(
        author: AuthenticatedUser,
        @RequestBody body: OperationOnUser,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            "admin/remove-user",
            userServices.delete(author.user, body.id),
            HttpStatus.ACCEPTED,
        ) {
            mapOf(
                "message" to "User removed successful",
            )
        }

    @PostMapping("/admin/deactivate-user")
    fun deactivateUser(
        author: AuthenticatedUser,
        @RequestBody body: OperationOnUser,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            "admin/deactivate-user",
            userServices.deactivate(author.user, body.id),
            HttpStatus.ACCEPTED,
        ) {
            mapOf(
                "message" to "User account deactivated successfully",
            )
        }

    @PostMapping("/admin/create-invite")
    fun createInvite(
        author: AuthenticatedUser,
        @RequestBody body: InviteRole,
    ): ResponseEntity<*> =
        handleUserOperationResult(
            "invite/create",
            inviteServices.createInvite(author.user, body.role),
            HttpStatus.CREATED,
        ) {
            mapOf(
                "inviteToken" to it.invite,
                "expiresAt" to it.expiresAt.toString(),
            )
        }

    @PostMapping(
        "/login",
    )
    fun login(
        @RequestBody body: LoginUserDTO,
        response: HttpServletResponse,
    ): ResponseEntity<*> {
        val result = userServices.login(body.username, body.password)
        return when (result) {
            is Failure -> handleLoginError(result.value, "/user/login")
            is Success -> {
                response.setHeader(HttpHeaders.SET_COOKIE, "token=${result.value.tokenValue}; HttpOnly; Path=/; Max-Age=86400")
                ResponseEntity.status(HttpStatus.ACCEPTED).body(
                    mapOf(
                        "token" to result.value.tokenValue,
                        "expiresAt" to result.value.tokenExpiration.toString(),
                        "message" to "Login successful",
                    ),
                )
            }
        }
    }

    @PostMapping(
        "/logout",
    )
    fun logout(me: AuthenticatedUser): ResponseEntity<*> {
        userServices.logout(me.token)
        return ResponseEntity.ok(
            mapOf(
                "message" to "Logout successful",
            ),
        )
    }

    private inline fun <T> handleUserOperationResult(
        path: String,
        result: Either<UserError, T>,
        status: HttpStatus = HttpStatus.OK,
        successBodyBuilder: (T) -> Any,
    ): ResponseEntity<*> =
        when (result) {
            is Failure -> handleUserError(result.value, path)
            is Success -> ResponseEntity.status(status).body(successBodyBuilder(result.value))
        }

    private fun handleLoginError(
        error: LoginError,
        instance: String,
    ): ResponseEntity<*> =
        when (error) {
            is LoginError.InvalidCredentials -> {
                ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        mapOf(
                            "error" to "Invalid credentials",
                        ),
                    )
            }
            is LoginError.DeactivatedAccount -> {
                ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                        mapOf(
                            "error" to "Account deactivated",
                        ),
                    )
            }
        } // TODO() Implement Problem Details

    private fun handleUserError(
        error: UserError,
        instance: String,
    ): ResponseEntity<ProblemDetail> =
        when (error) {
            is UserError.InvalidUsername ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-username",
                            title = "Invalid username",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided username format is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidEmail ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-email",
                            title = "Invalid email",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided email format is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidPassword ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-password",
                            title = "Invalid password",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided password format is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidName ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-name",
                            title = "Invalid name",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided name format is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidRole ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-role",
                            title = "Invalid role",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided role is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidProfilePictureURL ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-profile-picture-url",
                            title = "Invalid profile picture URL",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided profile picture URL is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidBio ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-bio",
                            title = "Invalid bio",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided bio format is invalid",
                            instance = instance,
                        ),
                    )

            is UserError.Unauthorized ->
                ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/unauthorized",
                            title = "Unauthorized",
                            status = HttpStatus.FORBIDDEN,
                            detail = "You do not have permission to perform this action",
                            instance = instance,
                        ),
                    )

            is UserError.UserNotFound ->
                ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/user-not-found",
                            title = "User not found",
                            status = HttpStatus.NOT_FOUND,
                            detail = "No user found with the provided ID",
                            instance = instance,
                        ),
                    )

            is UserError.NoUserFound ->
                ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/no-user-found",
                            title = "No user found",
                            status = HttpStatus.NOT_FOUND,
                            detail = "No users match the search criteria",
                            instance = instance,
                        ),
                    )

            is UserError.UsernameAlreadyExists ->
                ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/username-already-exists",
                            title = "Username already exists",
                            status = HttpStatus.CONFLICT,
                            detail = "The provided username is already associated with another account",
                            instance = instance,
                        ),
                    )

            is UserError.EmailAlreadyExists ->
                ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/email-already-exists",
                            title = "Email already exists",
                            status = HttpStatus.CONFLICT,
                            detail = "The provided email is already associated with another account",
                            instance = instance,
                        ),
                    )

            is UserError.InvalidInvite ->
                ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/invalid-invite",
                            title = "Invalid invite",
                            status = HttpStatus.BAD_REQUEST,
                            detail = "The provided invite token is invalid or expired",
                            instance = instance,
                        ),
                    )

            is UserError.DeactivatedAccount ->
                ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                        createProblemDetail(
                            type = "https://api.example.com/errors/deactivated-account",
                            title = "Deactivated account",
                            status = HttpStatus.FORBIDDEN,
                            detail = "The account associated with this user has been deactivated",
                            instance = instance,
                        ),
                    )
        }
}
