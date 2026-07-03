# Invalid invite

> HTTP `400` · `application/problem+json`

**Code:** `invalid-invite`

The provided invite token is invalid or expired.

## When it occurs

Raised during registration when the invitation token is unknown, malformed, or has expired (invitations expire one hour after being issued).

## How to resolve

Request a fresh invitation from an Administrator.
