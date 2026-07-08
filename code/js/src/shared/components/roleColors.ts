import type { UserRole } from '@/shared/services/users/users.types';

export const ROLE_COLORS: Record<UserRole, string> = {
    CONTRIBUTOR: '#006eff',
    EDITOR: '#179b00',
    ADMIN: '#6a00ff',
};

export const ROLE_COLOR_OPACITY = 25;
