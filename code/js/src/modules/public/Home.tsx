import { useI18n } from '@/shared/hooks/useI18n';
import { useAuthentication } from '@/shared/hooks/useAuthentication';

export function Home() {
    const { t } = useI18n();
    const { user } = useAuthentication();
    return (
        <div>
            <h1>{t('home.title')}</h1>
            <p>{user ? t('home.welcome.logged', { name: user }) : t('home.welcome')}</p>
        </div>
    );
}