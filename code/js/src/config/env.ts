export function getEnv(key: string) {
    // Vite (frontend)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key]
    }
    // Node (Playwright/backend)
    return process.env[key]
}
