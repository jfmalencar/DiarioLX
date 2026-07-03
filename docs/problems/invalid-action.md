# Invalid action

> HTTP `400` · `application/problem+json`

**Code:** `invalid-action`

The provided action is invalid.

## When it occurs

Raised when a workflow action is requested that is not permitted from the resource's current state.

## How to resolve

Check the resource's current state and request a transition that is valid from it.
