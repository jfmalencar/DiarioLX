import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { useMedia } from '@/shared/hooks/useMedia';
import { usePath } from '@/shared/hooks/usePath';
import { useUsers } from '@/shared/hooks/useUsers';
import { useSnackbar } from '@/shared/hooks/useSnackbar';

import { formatDate } from '@/shared/utils/format';
import { EditProfileModal, type ProfileUpdateData } from './EditProfileModal';

export function MyProfile() {
    const { user, hydrated, logout, refreshUser } = useAuthentication();
    const { updateProfile, completeAvatarUpload } = useUsers();
    const { t } = useI18n();
    const navigate = useNavigate();
    const { getSignedUrl } = useMedia();
    const { buildMediaUrl } = usePath();
    const { showSnackbar } = useSnackbar();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [imageHovered, setImageHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const bio = user?.bio?.trim() || '';
    const firstName = user?.firstName?.trim() || '';
    const lastName = user?.lastName?.trim() || '';
    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || t('myprofile.profile_name');
    const imageUrl = user?.profilePicturePath ? buildMediaUrl(user.profilePicturePath) : 'https://placehold.co/213x213/black/white?text=' + (displayName.charAt(0).toUpperCase() || 'U');
    const email = user?.email || t('common.no_email');
    const createdAtDate = user?.createdAt ? formatDate(new Date(user.createdAt)) : t('common.not_available');
    const role = user?.username?.toUpperCase() || t('common.not_available');
    const statusLabel = user?.isActive ? t('myprofile.active').toUpperCase() : t('myprofile.inactive').toUpperCase();
    const statusColor = user?.isActive ? '#1FBC7D' : '#6c757d';

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadLoading(true);
        try {
            const signedUpload = await getSignedUrl({ uploadType: 'PROFILE_PICTURES', altText: "Profile image", file, credits: [] });
            if (!signedUpload) {
                showSnackbar(t('common.upload_error'), 'error');
                return;
            }

            const uploadResponse = await fetch(signedUpload.signedUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });
            if (!uploadResponse.ok) {
                showSnackbar(t('common.upload_error'), 'error');
            }

            await completeAvatarUpload(signedUpload.id);
            await refreshUser();
        } catch (err) {
            console.error(err);
            showSnackbar(t('common.upload_error'), 'error');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleSaveProfile = async (updatedData: ProfileUpdateData) => {
        setSaveLoading(true);
        try {
            const result = await updateProfile(
                updatedData.username,
                updatedData.email,
                updatedData.password,
                updatedData.firstName,
                updatedData.lastName,
                updatedData.bio,
                updatedData.position
            );
            if (!result.ok) {
                showSnackbar(result.error, 'error');
                return;
            }
            showSnackbar(t('myprofile.update_success'), 'success');
            await refreshUser();
            setEditModalOpen(false);
        } catch (err) {
            console.error(err);
            showSnackbar(t('common.save_error'), 'error');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleLogoutClick = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className='d-flex justify-content-center py-4 py-lg-5'>
            <div style={{ width: '100%', maxWidth: 568, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{ position: 'relative', width: 213, height: 213, cursor: 'pointer' }}
                        onMouseEnter={() => setImageHovered(true)}
                        onMouseLeave={() => setImageHovered(false)}
                        onClick={handleImageUploadClick}
                    >
                        <img
                            style={{ width: 213, height: 213, position: 'relative' }}
                            className='rounded-circle border border-dark-subtle'
                            src={imageUrl}
                            alt={displayName}
                        />
                        {imageHovered && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ textAlign: 'center', color: 'white' }}>
                                    <Upload size={32} />
                                    <div style={{ fontSize: 12, marginTop: 8 }}>
                                        {uploadLoading ? t('common.loading') : t('myprofile.upload_picture')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <input
                        type='file'
                        ref={fileInputRef}
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                        disabled={uploadLoading}
                    />
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', position: 'relative' }}>
                        <div style={{ color: 'black', fontSize: 41, fontWeight: 600, wordWrap: 'break-word', textAlign: 'center', position: 'relative' }}>
                            {displayName}
                        </div>
                    </div>
                    <div style={{ color: 'black', fontSize: 22, fontWeight: 400, textTransform: 'lowercase', wordWrap: 'break-word', textAlign: 'center', position: 'relative' }}>
                        {email}
                    </div>
                    <div style={{ color: 'black', fontSize: 16, fontWeight: 400, wordWrap: 'break-word', textAlign: 'center', position: 'relative' }}>
                        {bio}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', marginTop: '0px' }}>
                        <span style={{ color: 'black', fontSize: 15, fontWeight: 400, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>{t('myprofile.created_at')} </span>
                        <span style={{ color: 'black', fontSize: 15, fontWeight: 600, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>{createdAtDate}</span>
                        <span style={{ color: 'black', fontSize: 15, fontWeight: 400, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>|</span>
                        <span style={{ color: 'black', fontSize: 15, fontWeight: 600, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>{role}</span>
                        <span style={{ color: 'black', fontSize: 15, fontWeight: 400, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                            <span style={{ color: statusColor, fontSize: 15, fontWeight: 600, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>
                                {statusLabel}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginTop: '16px', position: 'relative' }}>
                        <button
                            onClick={() => setEditModalOpen(true)}
                            style={{
                                padding: '8px 16px',
                                fontSize: 15,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: 'black',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {t('common.edit')}
                        </button>
                        <button
                            onClick={handleLogoutClick}
                            style={{
                                padding: '8px 16px',
                                fontSize: 15,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                border: '1px solid #dc3545',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#dc3545',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {t('common.logout')}
                        </button>
                    </div>
                </div>
                {!hydrated && (
                    <div className='position-absolute top-50 start-50 translate-middle text-uppercase small text-muted'>
                        {t('myprofile.loading')}
                    </div>
                )}
            </div>

            {editModalOpen && (
                <EditProfileModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    initialData={{
                        username: user?.username || '',
                        email: user?.email || '',
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        position: user?.position || '',
                        bio: user?.bio || '',
                    }}
                    onSave={handleSaveProfile}
                    isLoading={saveLoading}
                />
            )}
        </div>
    );
}