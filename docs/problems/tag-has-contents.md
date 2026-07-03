# Tag has contents

> HTTP `409` · `application/problem+json`

**Code:** `tag-has-contents`

A tag with associated contents cannot be deleted. Remove it from the contents first.

## When it occurs

Raised when deleting a tag that is still associated with content.

## How to resolve

Remove the tag from all content before deleting it.
