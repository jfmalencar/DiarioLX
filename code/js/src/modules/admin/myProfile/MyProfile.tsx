import { useState, useRef } from 'react';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/components/Modal';
import { useMedia } from '@/shared/hooks/useMedia';
import { Upload, Eye, EyeOff } from 'lucide-react';

const formatDate = (value: string | null | undefined) => {
    if (!value) {
        return 'N/D';
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'N/D';
    }

    return parsedDate.toLocaleDateString('pt-PT');
};

export function MyProfile() {
    const { user, hydrated, logout, updateProfile, refreshUser } = useAuthentication();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useI18n();
    const navigate = useNavigate();
    const { getSignedUrl, completeUpload } = useMedia();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [imageHovered, setImageHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const firstName = user?.firstName?.trim() || '';
    const lastName = user?.lastName?.trim() || '';
    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || t('myprofile.profile_name');
    const imageUrl = user?.profilePictureUrl?.trim() || 'https://placehold.co/213x213/black/white?text=' + (displayName.charAt(0).toUpperCase() || 'U');
    const email = user?.email || t('common.no_email');
    const createdAtDate = user?.createdAt ? formatDate(user.createdAt) : t('common.not_available');
    const role = user?.username?.toUpperCase() || t('common.not_available');
    const statusLabel = user?.isActive ? t('myprofile.active').toUpperCase() : t('myprofile.inactive').toUpperCase();
    const statusColor = user?.isActive ? '#1FBC7D' : '#6c757d';

    const handleEditClick = () => {
        setEditFormData({
            username: user?.username || '',
            email: user?.email || '',
            password: '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            bio: user?.bio || '',
        });
        setEditModalOpen(true);
    };

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadLoading(true);
        try {
            // Get signed URL
            const signedUpload = await getSignedUrl({
                file,
                altText: `Profile picture for ${displayName}`,
                photographerId: String(user?.id || ''),
            });

            if (!signedUpload) {
                alert(t('common.upload_error') || 'Upload failed');
                return;
            }

            // Upload using signed URL
            const uploadResponse = await fetch(signedUpload.signedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            // Complete upload
            await completeUpload(signedUpload.id);

            // Update profile with new image URL
            const fileUrl = signedUpload.signedUrl.split('?')[0]; // Remove query params
            await updateProfile(
                user?.username,
                user?.email,
                undefined,
                user?.firstName,
                user?.lastName,
                user?.bio || null,
                fileUrl
            );

            // Refresh user data to ensure all changes are reflected
            await refreshUser();
        } catch (err) {
            console.error(err);
            alert(t('common.upload_error') || 'Upload failed');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaveLoading(true);
        try {
            await updateProfile(
                editFormData.username,
                editFormData.email,
                editFormData.password || undefined,
                editFormData.firstName,
                editFormData.lastName,
                editFormData.bio || null,
                user?.profilePictureUrl || null
            );
            
            // Refresh user data to ensure all changes are reflected
            await refreshUser();
            
            setEditModalOpen(false);
        } catch (err) {
            console.error(err);
            alert(t('common.save_error') || 'Failed to save');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    return (
        <div className='d-flex justify-content-center py-4 py-lg-5'>
            <div style={{ width: '100%', maxWidth: 568, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

                    {/* Profile Picture with Upload Overlay */}
                    <div
                        style={{ 
                            position: 'relative', 
                            width: 213, 
                            height: 213,
                            cursor: 'pointer'
                        }}
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
                        <div style={{ color: 'black', fontSize: 41, fontFamily: 'Sora, sans-serif', fontWeight: 600, wordWrap: 'break-word', textAlign: 'center', position: 'relative' }}>
                            {displayName}
                        </div>
                    </div>

                    <div style={{ color: 'black', fontSize: 22, fontFamily: 'Sora, sans-serif', fontWeight: 400, textTransform: 'lowercase', wordWrap: 'break-word', textAlign: 'center', position: 'relative' }}>
                        {email}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', marginTop: '0px' }}>
                        <span style={{ color: 'black', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 400, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>{t('myprofile.created_at')} </span>
                        <span style={{ color: 'black', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>{createdAtDate}</span>
                        <span style={{ color: 'black', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 400, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>|</span>
                        <span style={{ color: 'black', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>{role}</span>
                        <span style={{ color: 'black', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 400, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                            <span style={{ color: statusColor, fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, textTransform: 'uppercase', wordWrap: 'break-word', position: 'relative' }}>
                                {statusLabel}
                            </span>
                            <div style={{ width: 14, height: 14, position: 'relative', overflow: 'hidden' }}>
                                <div style={{ width: 11.67, height: 11.67, position: 'relative', background: statusColor, margin: '1.17px' }} />
                                <div style={{ width: 0.90, height: 3.29, position: 'relative', background: statusColor, marginLeft: '6.55px', marginTop: '5.08px' }} />
                                <div style={{ width: 1.20, height: 1.20, position: 'relative', background: statusColor, marginLeft: '6.40px', marginTop: '2px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginTop: '16px', position: 'relative' }}>
                        <button
                            onClick={handleEditClick}
                            style={{
                                padding: '8px 16px',
                                fontSize: 15,
                                fontFamily: 'Sora, sans-serif',
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#999';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#ccc';
                            }}
                        >
                            {t('common.edit')}
                        </button>

                        <button
                            onClick={handleLogoutClick}
                            style={{
                                padding: '8px 16px',
                                fontSize: 15,
                                fontFamily: 'Sora, sans-serif',
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#dc3545';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#dc3545';
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

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                title={t('common.edit_profile')}
                onClose={() => setEditModalOpen(false)}
                buttons={[
                    {
                        key: 'cancel',
                        label: t('common.cancel'),
                        variant: 'secondary',
                        onClick: () => setEditModalOpen(false),
                    },
                    {
                        key: 'save',
                        label: t('common.save'),
                        variant: 'primary',
                        onClick: handleSaveProfile,
                        disabled: saveLoading,
                    },
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Username */}
                    <div className='mb-3'>
                        <label className='form-label'>{t('common.username')}</label>
                        <input
                            type='text'
                            className='form-control'
                            value={editFormData.username}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                        />
                    </div>

                    {/* Email */}
                    <div className='mb-3'>
                        <label className='form-label'>{t('common.email')}</label>
                        <input
                            type='email'
                            className='form-control'
                            value={editFormData.email}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>

                    {/* Password */}
                    <div className='mb-3'>
                        <label className='form-label'>{t('common.password')} ({t('common.optional')})</label>
                        <div className='input-group'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='form-control'
                                value={editFormData.password}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder={t('myprofile.password_placeholder')}
                            />
                            <button
                                type='button'
                                className='input-group-text border-0 border-bottom rounded-0 border-black bg-transparent'
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? t('register.hide_password') : t('register.show_password')}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* First Name */}
                    <div>
                        <label className='form-label'>{t('common.first_name')}</label>
                        <input
                            type='text'
                            className='form-control'
                            value={editFormData.firstName}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className='form-label'>{t('common.last_name')}</label>
                        <input
                            type='text'
                            className='form-control'
                            value={editFormData.lastName}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className='form-label'>{t('common.bio')}</label>
                        <textarea
                            className='form-control'
                            rows={4}
                            value={editFormData.bio}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
