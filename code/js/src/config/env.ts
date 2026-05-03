export function getEnv(key: string) {
    // Vite (frontend)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env[key]
    }

    // Node (Playwright/backend)
    return process.env[key]
}
