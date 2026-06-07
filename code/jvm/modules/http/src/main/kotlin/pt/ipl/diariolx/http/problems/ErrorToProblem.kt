package pt.ipl.diariolx.http.problems

import pt.ipl.diariolx.utils.AuthError
import pt.ipl.diariolx.utils.CategoryError
import pt.ipl.diariolx.utils.ContentError
import pt.ipl.diariolx.utils.InviteError
import pt.ipl.diariolx.utils.TagError
import pt.ipl.diariolx.utils.UserError

fun CategoryError.toProblem() =
    when (this) {
        is CategoryError.EmptyName -> Problem.emptyName
        is CategoryError.InvalidSlug -> Problem.invalidSlug
        is CategoryError.InvalidColor -> Problem.invalidColor
        is CategoryError.InvalidParent -> Problem.invalidParent
        is CategoryError.CategoryNotFound -> Problem.notFound
        is CategoryError.SlugAlreadyExists -> Problem.invalidSlug
    }

fun TagError.toProblem() =
    when (this) {
        is TagError.EmptyName -> Problem.emptyName
        is TagError.InvalidSlug -> Problem.invalidSlug
        is TagError.TagNotFound -> Problem.notFound
        is TagError.SlugAlreadyExists -> Problem.invalidSlug
    }

fun ContentError.toProblem() =
    when (this) {
        is ContentError.InvalidSlug -> Problem.invalidSlug
        is ContentError.ContentNotFound -> Problem.notFound
        is ContentError.EmptyName -> Problem.emptyName
        is ContentError.SlugAlreadyExists -> Problem.invalidSlug
    }

fun UserError.toProblem(): Problem =
    when (this) {
        is UserError.InvalidUsername -> Problem.invalidUsername
        is UserError.InvalidEmail -> Problem.invalidEmail
        is UserError.InvalidPassword -> Problem.invalidPassword
        is UserError.InvalidName -> Problem.invalidName
        is UserError.InvalidBio -> Problem.invalidBio
        is UserError.Unauthorized -> Problem.unauthorized
        is UserError.UserNotFound -> Problem.userNotFound
        is UserError.NoUserFound -> Problem.noUserFound
        is UserError.UsernameAlreadyExists -> Problem.usernameAlreadyExists
        is UserError.EmailAlreadyExists -> Problem.emailAlreadyExists
        is UserError.InvalidInvite -> Problem.invalidInvite
        is UserError.DeactivatedAccount -> Problem.deactivatedAccount
    }

fun AuthError.toProblem(): Problem =
    when (this) {
        is AuthError.DeactivatedAccount -> Problem.deactivatedAccount
        is AuthError.InvalidCredentials -> Problem.invalidCredentials
    }

fun InviteError.toProblem(): Problem =
    when (this) {
        is InviteError.InvalidRole -> Problem.invalidRole
        is InviteError.Unauthorized -> Problem.unauthorized
    }
