package pt.ipl.diariolx.utils

import pt.ipl.diariolx.domain.auth.UserTokens
import pt.ipl.diariolx.domain.users.User

sealed class UserError(
    val message: String,
) {
    object InvalidUsername : UserError("Invalid username format")

    object InvalidEmail : UserError("Invalid email format")

    object InvalidPassword : UserError("Invalid password format")

    object InvalidName : UserError("Invalid name format")

    object InvalidInvite : UserError("Invalid invite code")

    object InvalidBio : UserError("Invalid bio format")

    object Unauthorized : UserError("User is unauthorized")

    object UserNotFound : UserError("User not found")

    object NoUserFound : UserError("No user found")

    object UsernameAlreadyExists : UserError("Username already exists")

    object EmailAlreadyExists : UserError("Email already exists")

    object DeactivatedAccount : UserError("Your account is deactivated")

    object UserHasContents : UserError("User cannot be deleted while it has associated contents")
}

sealed class AuthError(
    val message: String,
) {
    object InvalidCredentials : AuthError("Invalid credentials")

    object DeactivatedAccount : AuthError("Your account is deactivated")
}

typealias UserCreateResult = Either<UserError, Int>

typealias UserUpdateResult = Either<UserError, Unit>

typealias UserResult = Either<UserError, User>

typealias UsersResult = Either<UserError, List<User>>

typealias LoginResult = Either<AuthError, UserTokens>

typealias UserValidationResult = Either<UserError, Unit>
