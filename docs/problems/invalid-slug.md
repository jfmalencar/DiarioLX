# Invalid slug

> HTTP `400` · `application/problem+json`

**Code:** `invalid-slug`

The provided slug is either invalid or already in use.

## When it occurs

Raised when creating or updating a resource with a slug that is malformed or already used by another resource of the same type.

## How to resolve

Provide a URL-safe slug (lowercase, hyphen-separated) that is not already taken; leave it empty to have one generated from the title.
