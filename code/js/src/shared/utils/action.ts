import type { Result } from '@/shared/types/Result';
import { getErrorMessage } from '@/shared/utils/error';

export async function runAction<T>(fn: () => Promise<T>, fallback: string, setLoading: (loading: boolean) => void, setError: (error: string | null) => void): Promise<Result<T>> {
    setLoading(true);
    setError(null);
    try {
        const data = await fn();
        return { ok: true, data };
    } catch (err) {
        const message = getErrorMessage(err, fallback);
        setError(message);
        return { ok: false, error: message };
    } finally {
        setLoading(false);
    }
}
