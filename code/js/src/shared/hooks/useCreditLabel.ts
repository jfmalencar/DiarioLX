import { useBootstrap } from './useBootstrap';

// Returns a function mapping a credit role (e.g. "PHOTOGRAPHER") to its byline
// label (e.g. "Fotografia"), sourced from the backend bootstrap so labels live
// in one place. Falls back to a de-snake-cased role for anything unknown.
export const useCreditLabel = () => {
    const { creditRoles } = useBootstrap();
    return (role: string): string =>
        creditRoles.find((r) => r.value === role)?.byline ?? role.replace(/_/g, ' ');
};
