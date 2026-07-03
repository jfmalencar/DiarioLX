# Unauthorized

> HTTP `401` · `application/problem+json`

**Code:** `unauthorized`

You do not have permission to perform this action.

## When it occurs

Raised when the request has no valid session, or the authenticated user's role is insufficient for the operation.

## How to resolve

Authenticate first, or perform the action with an account that holds the required role.
