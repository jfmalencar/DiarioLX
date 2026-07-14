# Forbidden

> HTTP `403` · `application/problem+json`

**Code:** `forbidden`

The account associated with this user does not have the required permission.

## When it occurs

Raised when the request is authenticated but the user's role is below the one required for the operation.

## How to resolve

Perform the action with an account that holds the required role.
