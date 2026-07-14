# API Problem Types

The DiárioLX REST API reports errors as `application/problem+json` responses, following
[RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457). Every
error response carries:

- a `type` URI that dereferences to the problem page in this catalogue;
- a short, human-readable `title`;
- the HTTP `status` code;
- a `detail` message describing the specific occurrence;
- an `instance` — the request path that produced the error.

Each problem below links to a page explaining when it occurs and how to resolve it.

| Problem | Code | HTTP status |
| --- | --- | --- |
| [Resource not found](resource-not-found.md) | `resource-not-found` | 404 |
| [Invalid slug](invalid-slug.md) | `invalid-slug` | 400 |
| [Invalid color](invalid-color.md) | `invalid-color` | 400 |
| [Invalid parent](invalid-parent.md) | `invalid-parent` | 400 |
| [Invalid action](invalid-action.md) | `invalid-action` | 400 |
| [Empty name](empty-name.md) | `empty-name` | 400 |
| [Empty field](empty-field.md) | `empty-field` | 400 |
| [Invalid field](invalid-field.md) | `invalid-field` | 400 |
| [Invalid username](invalid-username.md) | `invalid-username` | 400 |
| [Invalid email](invalid-email.md) | `invalid-email` | 400 |
| [Invalid password](invalid-password.md) | `invalid-password` | 400 |
| [Invalid name](invalid-name.md) | `invalid-name` | 400 |
| [Invalid role](invalid-role.md) | `invalid-role` | 400 |
| [Invalid bio](invalid-bio.md) | `invalid-bio` | 400 |
| [Unauthorized](unauthorized.md) | `unauthorized` | 401 |
| [Forbidden](forbidden.md) | `forbidden` | 403 |
| [User not found](user-not-found.md) | `user-not-found` | 400 |
| [No user found](no-user-found.md) | `no-user-found` | 400 |
| [Username already exists](username-already-exists.md) | `username-already-exists` | 409 |
| [Email already exists](email-already-exists.md) | `email-already-exists` | 409 |
| [Invalid invite](invalid-invite.md) | `invalid-invite` | 400 |
| [Deactivated account](deactivated-account.md) | `deactivated-account` | 403 |
| [Invalid credentials](invalid-credentials.md) | `invalid-credentials` | 400 |
| [Author not found](author-not-found.md) | `author-not-found` | 400 |
| [Category not found](category-not-found.md) | `category-not-found` | 400 |
| [Featured media ID not found](featured-media-not-found.md) | `featured-media-not-found` | 400 |
| [Tag not found](tag-not-found.md) | `tag-not-found` | 400 |
| [Insufficient photos](insufficient-photos.md) | `insufficient-photos` | 400 |
| [Category has contents](category-has-contents.md) | `category-has-contents` | 409 |
| [Tag has contents](tag-has-contents.md) | `tag-has-contents` | 409 |
| [Published content is locked](published-locked.md) | `published-locked` | 403 |
| [Not the content owner](not-content-owner.md) | `not-content-owner` | 403 |
