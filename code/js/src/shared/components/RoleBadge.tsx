import type { UserRole } from '@/shared/services/users/users.types';
import { useI18n } from '@/shared/hooks/useI18n';
import { ROLE_COLORS, ROLE_COLOR_OPACITY } from '@/shared/components/roleColors';

export const RoleBadge = ({ role }: { role: UserRole }) => {
    const { t } = useI18n();
    return (
        <div
            className='badge rounded-pill px-3 py-2 fw-medium'
            style={{ backgroundColor: `${ROLE_COLORS[role]}${ROLE_COLOR_OPACITY}` }}
        >
            <span className='text-sm font-weight-bold' style={{ color: ROLE_COLORS[role] }}>
                {t(`users.${role.toLowerCase()}`).toUpperCase()}
            </span>
        </div>
    );
};
