// Discriminated result returned by hook mutation actions, mirroring the
// http-client ApiResult shape. The error string carries the server's
// problem+json detail (or title) when available.
export type Result<T = void> =
    | { ok: true; data?: T }
    | { ok: false; error: string };
