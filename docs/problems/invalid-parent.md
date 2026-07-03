# Invalid parent

> HTTP `400` · `application/problem+json`

**Code:** `invalid-parent`

The provided parent is invalid or does not exist.

## When it occurs

Raised when a category's parent references a category that does not exist or forms an invalid hierarchy (such as pointing to itself).

## How to resolve

Reference an existing category as the parent, or omit it to create a top-level category.
