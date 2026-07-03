import { useEffect, useState } from 'react';

import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { UnderlineTextArea } from '@/shared/components/inputs/UnderlineTextArea';
import { Button } from '@/shared/components/Button';
import { useSettings } from '@/shared/hooks/useSettings';
import { useCategories } from '@/shared/hooks/useCategories';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
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
    const [form, setForm] = useState<BackofficeSettings>(EMPTY);

    useEffect(() => {
        fetch().then((s) => {
            if (s) setForm(s);
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
        showSnackbar(res.ok ? 'Definições guardadas.' : res.error, res.ok ? 'success' : 'error');
    };

    return (
        <div className='row justify-content-center'>
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
                description='Links das redes sociais apresentados no rodapé do site.'
            >
                <UnderlineInput
                    value={form.social.facebook}
                    name='facebook'
                    placeholder='https://facebook.com/...'
                    disabled={loading}
                    onChange={(e) => setSocial('facebook', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='Email'>
                <UnderlineInput
                    value={form.contact.email}
                    name='email'
                    placeholder='exemplo@dominio.pt'
                    disabled={loading}
                    onChange={(e) => setContact('email', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='Morada' description='Contactos apresentados no rodapé do site.'>
                <UnderlineTextArea
                    value={form.contact.address}
                    name='address'
                    placeholder='Morada da redação'
                    disabled={loading}
                    onChange={(e) => setContact('address', e.currentTarget.value)}
                />
            </FieldSection>

            <FieldSection title='Registo ERC' description='Ficha técnica apresentada no rodapé do site.'>
                <UnderlineInput
                    value={form.publication.erc}
                    name='erc'
                    placeholder='128219'
                    disabled={loading}
                    onChange={(e) => setPublication('erc', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='Periodicidade'>
                <UnderlineInput
                    value={form.publication.periodicity}
                    name='periodicity'
                    placeholder='Diário'
                    disabled={loading}
                    onChange={(e) => setPublication('periodicity', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='NIPC' description='Número de registo de pessoa coletiva.'>
                <UnderlineInput
                    value={form.publication.nipc}
                    name='nipc'
                    placeholder='508 519 713'
                    disabled={loading}
                    onChange={(e) => setPublication('nipc', e.currentTarget.value)}
                />
            </FieldSection>
            <FieldSection title='Proprietário'>
                <UnderlineInput
                    value={form.publication.owner}
                    name='owner'
                    placeholder='Proprietário da publicação'
                    disabled={loading}
                    onChange={(e) => setPublication('owner', e.currentTarget.value)}
                />
            </FieldSection>

            <FieldSection
                title='Categorias em destaque'
                description='As categorias selecionadas aparecem diretamente no menu; as restantes ficam sob “Secções”.'
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
                title='Secções por tipo'
                description='Mostra ou esconde estas secções no menu de navegação.'
            >
                {([
                    ['showPhotos', 'Fotografia'],
                    ['showPodcasts', 'Podcasts'],
                    ['showVideos', 'Vídeos'],
                ] as const).map(([key, label]) => (
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
                            {label}
                        </label>
                    </div>
                ))}
            </FieldSection>
            <div className='d-flex justify-content-end gap-3 pt-2'>
                <Button
                    dataTestId='save-settings-button'
                    type='button'
                    disabled={loading}
                    onClick={handleSave}
                >
                    {loading ? 'A guardar...' : 'Guardar definições'}
                </Button>
            </div>
        </div>
    );
};
