import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/shared/hooks/useI18n';
import { Modal } from '@/shared/components/modals/Modal';

export type ProfileUpdateData = {
    username: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    position: string | null;
    bio: string | null;
};

type EditProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        position: string;
        bio: string;
    };
    onSave: (data: ProfileUpdateData) => Promise<void>;
    isLoading: boolean;
};

export function EditProfileModal({ isOpen, onClose, initialData, onSave, isLoading }: EditProfileModalProps) {
    const { t } = useI18n();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        ...initialData,
        password: '',
    });

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmSave = () => {
        onSave({
            username: formData.username,
            email: formData.email,
            password: formData.password || undefined,
            firstName: formData.firstName,
            lastName: formData.lastName,
            position: formData.position || null,
            bio: formData.bio || null,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            title={t('common.edit_profile')}
            onClose={onClose}
            buttons={[
                {
                    key: 'cancel',
                    label: t('common.cancel'),
                    variant: 'danger',
                    onClick: onClose,
                    disabled: isLoading,
                },
                {
                    key: 'save',
                    label: isLoading ? t('common.loading') : t('common.save'),
                    variant: 'primary',
                    onClick: handleConfirmSave,
                    disabled: isLoading,
                },
            ]}
            size="lg"
        >
            <div className="row g-3 py-2">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small">{t('common.first_name')}</label>
                    <input
                        type="text"
                        className="form-control rounded-2 py-2"
                        value={formData.firstName}
                        minLength={3}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small">{t('common.last_name')}</label>
                    <input
                        type="text"
                        className="form-control rounded-2 py-2"
                        value={formData.lastName}
                        minLength={3}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    />
                </div>

                {/* Account Details Row */}
                <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small">{t('common.username')}</label>
                    <input
                        type="text"
                        className="form-control rounded-2 py-2"
                        value={formData.username}
                        onChange={(e) => handleFieldChange('username', e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small">{t('common.email')}</label>
                    <input
                        type="email"
                        className="form-control rounded-2 py-2"
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                    />
                </div>

                {/* Status & Security */}
                <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small">{t('myprofile.position')}</label>
                    <input
                        type="text"
                        className="form-control rounded-2 py-2"
                        placeholder={t('myprofile.position_placeholder')}
                        value={formData.position}
                        onChange={(e) => handleFieldChange('position', e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small">
                        {t('common.password')} <span className="text-muted fw-normal">({t('common.optional')})</span>
                    </label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control rounded-start-2 py-2 border-end-0"
                            value={formData.password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            placeholder={t('myprofile.password_placeholder')}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-end-2 border-start-0 px-3 d-flex align-items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? t('register.hide_password') : t('register.show_password')}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Narrative Profile Bio */}
                <div className="col-12">
                    <label className="form-label fw-medium text-secondary small">{t('common.bio')}</label>
                    <textarea
                        className="form-control rounded-2"
                        rows={4}
                        style={{ resize: 'none' }}
                        value={formData.bio}
                        onChange={(e) => handleFieldChange('bio', e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
}