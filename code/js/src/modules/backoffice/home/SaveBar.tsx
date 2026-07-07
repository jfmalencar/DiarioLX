import { useI18n } from '@/shared/hooks/useI18n';

type Props = {
    visible: boolean;
    saving: boolean;
    onSave: () => void;
    onCancel: () => void;
};

export const SaveBar = ({ visible, saving, onSave, onCancel }: Props) => {
    const { t } = useI18n();
    return (
        <div
            className='position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg'
            style={{
                transform: visible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.25s ease',
                zIndex: 1040,
            }}
        >
            <div
                className='d-flex align-items-center justify-content-between py-3 px-4 mx-auto'
                style={{ maxWidth: 1100 }}
            >
                <span className='text-secondary'>{t('homepage.unsaved_changes')}</span>
                <div className='d-flex gap-2'>
                    <button
                        type='button'
                        className='btn btn-outline-dark'
                        onClick={onCancel}
                        disabled={saving}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type='button'
                        className='btn btn-dark'
                        onClick={onSave}
                        disabled={saving}
                    >
                        {saving ? t('homepage.saving') : t('common.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};