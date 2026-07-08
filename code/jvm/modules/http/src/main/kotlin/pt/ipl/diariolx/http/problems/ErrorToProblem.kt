package pt.ipl.diariolx.http.problems

import pt.ipl.diariolx.utils.AuthError
import pt.ipl.diariolx.utils.CategoryError
import pt.ipl.diariolx.utils.ContentError
import pt.ipl.diariolx.utils.FeaturedError
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
        is CategoryError.CategoryHasContents -> Problem.categoryHasContents
    }

fun TagError.toProblem() =
    when (this) {
        is TagError.EmptyName -> Problem.emptyField
        is TagError.InvalidSlug -> Problem.invalidSlug
        is TagError.TagNotFound -> Problem.notFound
        is TagError.SlugAlreadyExists -> Problem.invalidSlug
        is TagError.TagHasContents -> Problem.tagHasContents
    }

fun ContentError.toProblem() =
    when (this) {
        is ContentError.InvalidSlug -> Problem.invalidSlug
        is ContentError.ContentNotFound -> Problem.notFound
        is ContentError.EmptyField -> Problem.emptyField
        is ContentError.IncompleteContent -> Problem.emptyField
        is ContentError.InvalidType -> Problem.invalidField
        is ContentError.SlugAlreadyExists -> Problem.invalidSlug
        is ContentError.AuthorNotFound -> Problem.authorNotFound
        is ContentError.CategoryNotFound -> Problem.categoryNotFound
        is ContentError.FeaturedMediaIdNotFound -> Problem.featuredMediaIdNotFound
        is ContentError.TagNotFound -> Problem.tagNotFound
        is ContentError.InsufficientPhotos -> Problem.insufficientPhotos
        is ContentError.ParentRequired -> Problem.emptyField
        is ContentError.InvalidParent -> Problem.invalidParent
        is ContentError.InvalidEmbed -> Problem.invalidField
        is ContentError.PublishedLocked -> Problem.publishedLocked
        is ContentError.NotContentOwner -> Problem.notContentOwner
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
        is UserError.UserHasContents -> Problem.userHasContents
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
        is InviteError.ActionError -> Problem.invalidAction
    }

fun FeaturedError.toProblem(): Problem =
    when (this) {
        is FeaturedError.ContentNotFound -> Problem.notFound
        is FeaturedError.TooManyArticles -> Problem.invalidField
        is FeaturedError.DuplicateSingleton -> Problem.invalidField
        is FeaturedError.CategoryRequired -> Problem.invalidField
        is FeaturedError.CategoryNotAllowed -> Problem.invalidField
    }
