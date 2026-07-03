# Invalid color

> HTTP `400` · `application/problem+json`

**Code:** `invalid-color`

The provided color is either invalid or already in use.

## When it occurs

Raised when a category is created or updated with a colour that is not a valid value or clashes with another category.

## How to resolve

Provide a valid colour (for example a hex code) that satisfies the format and uniqueness rules.
