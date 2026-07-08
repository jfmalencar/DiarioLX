import { useState, useEffect } from 'react';
import { UserIcon } from 'lucide-react';

import { useI18n } from '@/shared/hooks/useI18n';
import { usePath } from '@/shared/hooks/usePath';
import { useUsers, type User, type UserRole } from '@/shared/hooks/useUsers';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { Modal } from '@/shared/components/modals/Modal';
import { useAuthentication } from '@/shared/hooks/useAuthentication';

type Props = {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
};

const formatDate = (value: string | null | undefined) => {
    const { t } = useI18n();
    if (!value) return t('common.not_available');
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return t('common.not_available');
    return parsedDate.toLocaleDateString('pt-PT');
};

export function UserPreviewModal({ user, isOpen, onClose, onSuccess }: Props) {
    const { t } = useI18n();
    const { buildMediaUrl } = usePath();
    const { showSnackbar } = useSnackbar();
    const me = useAuthentication().user;
    
    const isAdmin = me?.role === 'ADMIN';
    
    const { updateRole, setOnTeam } = useUsers(); 
    
    const [selectedRole, setSelectedRole] = useState<UserRole>('CONTRIBUTOR');
    const [isOnTeam, setIsOnTeam] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role);
            setIsOnTeam(!!user.onTeam);
        }
    }, [user, isOpen]);

    if (!user) return null;

    const bio = user.bio?.trim() || '';
    const firstName = user.firstName?.trim() || '';
    const lastName = user.lastName?.trim() || '';
    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || t('myprofile.profile_name');
    const imageUrl = user.profilePicturePath ? buildMediaUrl(user.profilePicturePath) : null;
    const email = user.email || t('common.no_email');
    const createdAtDate = user.createdAt ? formatDate(user.createdAt) : t('common.not_available');
    const statusLabel = user.isActive ? t('myprofile.active').toUpperCase() : t('myprofile.inactive').toUpperCase();
    const statusColor = user.isActive ? '#1FBC7D' : '#6c757d';

    const hasChanges = selectedRole !== user.role || isOnTeam !== user.onTeam;

    const handleSave = async () => {
        if (!isAdmin) return; // Salvaguarda extra de segurança por código
        setSaveLoading(true);
        try {
            if (selectedRole !== user.role) {
                console.log('Updating role for user', user.userId, 'to', selectedRole);
                const roleRes = await updateRole(user.userId, selectedRole);
                if (roleRes && !roleRes.ok) {
                    showSnackbar(roleRes.error || t('users.update_role_error'), 'error');
                    return;
                }
            }
            if (isOnTeam !== user.onTeam) {
                await setOnTeam(user.userId, isOnTeam);
            }

            showSnackbar(t('users.update_role_success'), 'success');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            showSnackbar(t('common.save_error'), 'error');
        } finally {
            setSaveLoading(false);
        }
    };

    const modalButtons = [
        {
            key: 'cancel',
            label: isAdmin ? t('common.cancel') : t('common.close'),
            variant: 'secondary' as const,
            onClick: onClose,
        },
        ...(isAdmin ? [{
            key: 'save',
            label: t('common.save'),
            variant: 'primary' as const,
            onClick: handleSave,
            disabled: saveLoading || !hasChanges,
        }] : [])
    ];

    return (
        <Modal
            isOpen={isOpen}
            title={t('users.view_user_details')}
            onClose={onClose}
            size="lg"
            buttons={modalButtons}
        >
            <div className='row py-2'>
                <div className='col-12 col-md-4 d-flex flex-column align-items-center border-end border-light-subtle pb-3 pb-md-0'>
                    <div 
                        className='d-flex align-items-center justify-content-center rounded-circle border border-dark-subtle bg-light flex-shrink-0 mb-3'
                        style={{ width: 140, height: 140, overflow: 'hidden' }}
                    >
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={displayName} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <UserIcon size={48} className="text-secondary" />
                        )}
                    </div>
                    <div className='form-check form-switch d-flex align-items-center gap-2 m-0 mt-2 bg-light p-2 px-3 rounded border'>
                        <input
                            className='form-check-input m-0'
                            type='checkbox'
                            role='switch'
                            id='modalTeamSwitch'
                            checked={isOnTeam}
                            onChange={(e) => setIsOnTeam(e.target.checked)}
                            disabled={saveLoading || !isAdmin}
                            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                        />
                        <label className='form-check-label small fw-medium text-secondary' htmlFor='modalTeamSwitch' style={{ cursor: isAdmin ? 'pointer' : 'default' }}>
                            {t('users.show_on_team')}
                        </label>
                    </div>
                </div>
                <div className='col-12 col-md-8 ps-md-4 d-flex flex-column justify-content-between'>
                    <div>
                        <h3 className="fw-semibold text-dark mb-1" style={{ fontSize: '1.6rem' }}>{displayName}</h3>
                        <div className="text-muted mb-2 fw-medium" style={{ fontSize: '1rem' }}>{user.position || '-'}</div>
                        <div className="text-secondary small text-lowercase mb-3">{email}</div>
                        
                        {bio && (
                            <div className="mb-3">
                                <span className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: 11, letterSpacing: '0.5px' }}>{t('common.bio')}</span>
                                <p className="text-secondary bg-light p-2.5 px-3 rounded border mb-0 small" style={{ whiteSpace: 'pre-line' }}>
                                    {bio}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className='d-flex align-items-center gap-2 border-bottom border-top py-2 w-100 text-uppercase text-muted' style={{ fontSize: 12, letterSpacing: '0.5px' }}>
                            <span>{t('myprofile.created_at')}</span>
                            <span className="fw-semibold text-dark">{createdAtDate}</span>
                            <span>|</span>
                            <span>{t('register.username')}:</span>
                            <span className="fw-semibold text-dark text-none">{user.username}</span>
                            <span>|</span>
                            <div className='d-flex align-items-center gap-1'>
                                <span style={{ color: statusColor, fontWeight: 600 }}>
                                    {statusLabel}
                                </span>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                            </div>
                        </div>
                        <div className="w-100 mt-3">
                            <label className="form-label fw-semibold text-uppercase text-muted small mb-1" style={{ letterSpacing: '0.5px', fontSize: 11 }}>
                                {t('users.role')}
                            </label>
                            <select 
                                className="form-select form-select-sm"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                disabled={saveLoading || !isAdmin}
                            >
                                <option value="ADMIN">{t('users.admin')}</option>
                                <option value="EDITOR">{t('users.editor')}</option>
                                <option value="CONTRIBUTOR">{t('users.contributor')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}