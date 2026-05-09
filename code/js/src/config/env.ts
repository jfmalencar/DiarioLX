export function getEnv(key: string) {
    // Vite (frontend)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        console.log(import.meta.env)
        return import.meta.env[key]
    }

    // Node (Playwright/backend)
    return process.env[key]
}
