import { useEffect, useState } from 'react';

import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { UnderlineTextArea } from '@/shared/components/inputs/UnderlineTextArea';
import { SaveBar } from '@/shared/components/SaveBar';
import { useSettings } from '@/shared/hooks/useSettings';
import { useCategories } from '@/shared/hooks/useCategories';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { useI18n } from '@/shared/hooks/useI18n';
import type { BackofficeSettings } from '@/shared/services/settings/settings.types';

const EMPTY: BackofficeSettings = {
    social: { facebook: '', twitter: '', instagram: '' },
    contact: { email: '', address: '' },
    publication: { erc: '', periodicity: '', owner: '', nipc: '' },
    navigation: { featuredCategories: [], showPhotos: false, showPodcasts: false, showVideos: false },
};

export const Settings = () => {
    const { fetch, save, loading } = useSettings();
    const { categories, fetchAll } = useCategories();
    const { showSnackbar } = useSnackbar();
    const { t } = useI18n();
    const [form, setForm] = useState<BackofficeSettings>(EMPTY);
    const [saved, setSaved] = useState<BackofficeSettings>(EMPTY);

    useEffect(() => {
        fetch().then((s) => {
            if (s) {
                setForm(s);
                setSaved(s);
            }
        });
    }, [fetch]);

    useEffect(() => {
        fetchAll({ size: 100 });
    }, [fetchAll]);

    const setSocial = (key: keyof BackofficeSettings['social'], value: string) =>
        setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));

    const setContact = (key: keyof BackofficeSettings['contact'], value: string) =>
        setForm((f) => ({ ...f, contact: { ...f.contact, [key]: value } }));

    const setPublication = (key: keyof BackofficeSettings['publication'], value: string) =>
        setForm((f) => ({ ...f, publication: { ...f.publication, [key]: value } }));

    const setNav = (key: 'showPhotos' | 'showPodcasts' | 'showVideos', value: boolean) =>
        setForm((f) => ({ ...f, navigation: { ...f.navigation, [key]: value } }));

    const toggleCategory = (slug: string) =>
        setForm((f) => ({
            ...f,
            navigation: {
                ...f.navigation,
                featuredCategories: f.navigation.featuredCategories.includes(slug)
                    ? f.navigation.featuredCategories.filter((s) => s !== slug)
                    : [...f.navigation.featuredCategories, slug],
            },
        }));

    const handleSave = async () => {
        const res = await save(form);
        if (res.ok) setSaved(form);
        showSnackbar(res.ok ? t('settings.saved') : res.error, res.ok ? 'success' : 'error');
    };

    const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

    return (
        <div className='row justify-content-center' style={{ paddingBottom: '5rem' }}>
            <FieldSection title='Twitter'>
                <UnderlineInput
                    value={form.social.twitter}
                    name='twitter'
                    placeholder='https://twitter.com/...'
                    disabled={loading}
                    onChange={(e) => setSocial('twitter', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='Instagram'>
                <UnderlineInput
                    value={form.social.instagram}
                    name='instagram'
                    placeholder='https://instagram.com/...'
                    disabled={loading}
                    onChange={(e) => setSocial('instagram', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection
                title='Facebook'
                description={t('settings.social_description')}
            >
                <UnderlineInput
                    value={form.social.facebook}
                    name='facebook'
                    placeholder='https://facebook.com/...'
                    disabled={loading}
                    onChange={(e) => setSocial('facebook', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title={t('common.email')}>
                <UnderlineInput
                    value={form.contact.email}
                    name='email'
                    placeholder='exemplo@dominio.pt'
                    disabled={loading}
                    onChange={(e) => setContact('email', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title={t('settings.address_title')} description={t('settings.contact_description')}>
                <UnderlineTextArea
                    value={form.contact.address}
                    name='address'
                    placeholder={t('settings.address_placeholder')}
                    disabled={loading}
                    onChange={(e) => setContact('address', e.currentTarget.value)}
                />
            </FieldSection>

            <FieldSection title={t('settings.erc_title')} description={t('settings.erc_description')}>
                <UnderlineInput
                    value={form.publication.erc}
                    name='erc'
                    placeholder='128219'
                    disabled={loading}
                    onChange={(e) => setPublication('erc', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title={t('settings.periodicity_title')}>
                <UnderlineInput
                    value={form.publication.periodicity}
                    name='periodicity'
                    placeholder={t('settings.periodicity_placeholder')}
                    disabled={loading}
                    onChange={(e) => setPublication('periodicity', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='NIPC' description={t('settings.nipc_description')}>
                <UnderlineInput
                    value={form.publication.nipc}
                    name='nipc'
                    placeholder='508 519 713'
                    disabled={loading}
                    onChange={(e) => setPublication('nipc', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title={t('settings.owner_title')}>
                <UnderlineInput
                    value={form.publication.owner}
                    name='owner'
                    placeholder={t('settings.owner_placeholder')}
                    disabled={loading}
                    onChange={(e) => setPublication('owner', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection
                title={t('settings.featured_categories_title')}
                description={t('settings.featured_categories_description')}
            >
                <div className='row g-2'>
                    {categories.map((cat) => (
                        <div className='col-12 col-md-6' key={cat.id}>
                            <div className='form-check'>
                                <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id={`cat-${cat.slug}`}
                                    checked={form.navigation.featuredCategories.includes(cat.slug)}
                                    onChange={() => toggleCategory(cat.slug)}
                                />
                                <label className='form-check-label' htmlFor={`cat-${cat.slug}`}>
                                    {cat.name}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </FieldSection>
            <FieldSection
                title={t('settings.sections_by_type_title')}
                description={t('settings.sections_by_type_description')}
            >
                {([
                    ['showPhotos', 'settings.section_photos'],
                    ['showPodcasts', 'settings.section_podcasts'],
                    ['showVideos', 'settings.section_videos'],
                ] as const).map(([key, labelKey]) => (
                    <div className='form-check form-switch' key={key}>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            role='switch'
                            id={key}
                            checked={form.navigation[key]}
                            onChange={(e) => setNav(key, e.target.checked)}
                        />
                        <label className='form-check-label' htmlFor={key}>
                            {t(labelKey)}
                        </label>
                    </div>
                ))}
            </FieldSection>
            <SaveBar
                visible={isDirty}
                saving={loading}
                onSave={handleSave}
                onCancel={() => setForm(saved)}
                saveTestId='save-settings-button'
            />
        </div>
    );
};
