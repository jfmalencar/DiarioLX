import { useBootstrap } from './useBootstrap';

export const useCreditLabel = () => {
    const { creditRoles } = useBootstrap();
    return (role: string): string =>
        creditRoles.find((r) => r.value === role)?.byline ?? role.replace(/_/g, ' ');
};
