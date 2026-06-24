import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { CheckCircle, XCircle, History, PanelRightClose } from 'lucide-react';

import { ContentPreview } from '@/shared/components/ContentPreview';
import { type Content, useContents } from '@/shared/hooks/useContents';
import { useSnackbar } from '@/shared/hooks/useSnackbar';

import icon from '@/assets/icon.svg';

import { ReviewModal } from './ReviewModal';
import type { HistoryEntry, HistoryEntryType } from '@/shared/services/contents/contents.types';
import { useI18n } from '@/shared/hooks/useI18n';

const historyConfig: Record<HistoryEntryType, { label: string; sublabel: string; sublabelColor: string; icon: typeof CheckCircle; iconColor: string }> = {
    'approved': { label: 'PUBLICAÇÃO', sublabel: 'APROVADA', sublabelColor: '#2d6a4f', icon: CheckCircle, iconColor: '#2d6a4f' },
    'rejected': { label: 'PUBLICAÇÃO', sublabel: 'REJEITADA', sublabelColor: '#9b2335', icon: XCircle, iconColor: '#9b2335' },
};

const HistoryEntryCard = ({ entry }: { entry: HistoryEntry }) => {
    const config = historyConfig[entry.type];
    const Icon = config.icon;
    const { t } = useI18n();
    return (
        <div className='pb-4 mb-4 border-bottom'>
            <div className='d-flex align-items-center justify-content-between mb-2'>
                <div className='d-flex align-items-center gap-2'>
                    <Icon size={16} color={config.iconColor} />
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        {config.label}{' '}
                        <strong style={{ color: config.sublabelColor }}>{config.sublabel}</strong>
                    </span>
                </div>
                <span className='text-muted' style={{ fontSize: '0.75rem' }}>{new Date(entry.date).toLocaleDateString()}</span>
            </div>
            {entry.comment && (
                <div className='mb-2' style={{ fontSize: '0.85rem', color: '#333' }}>
                    {entry.comment}
                </div>
            )}
            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                {t('common.by_uppercase')} <strong>{entry.by ? entry.by : t('common.unknown_uppercase')}</strong>
            </div>
        </div>
    );
};

export const ReviewContent = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { fetchById, fetchHistoryById, publish, reject } = useContents();
    const [content, setContent] = useState<Content | null>(null);
    const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const { t } = useI18n();
    
    const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const load = async () => {
            if (params.id && params.id !== 'new') {
                await fetchById(Number(params.id)).then((content) => {
                    if (content && content.state !== 'PENDING_REVIEW') {
                        navigate('/backoffice/contents');
                    }
                    if (content) {
                        setContent(content);
                    }
                });
            }
        };
        load();
    }, [fetchById, params.id, navigate]);

    useEffect(() => {
        const loadHistory = async () => {
            if (content?.id) {
                const data = await fetchHistoryById(content.id);
                if (data?.history) {
                    setHistoryList(data.history);
                }
            }
        };
        loadHistory();
    }, [fetchHistoryById, content?.id]);

    const handleConfirmReview = async (comment: string) => {
        setOpenConfirmModal(false);
        
        if (modalAction === 'approve') {
            const result = await publish(Number(params.id), comment); 
            if (result) {
                showSnackbar('Conteúdo publicado com sucesso!', 'success');
                navigate('/p/' + content?.slug);
            } else {
                showSnackbar('Algo deu errado. Tente novamente');
            }
        } else {
            const result = await reject(Number(params.id), comment);
            if (result) {
                showSnackbar('Conteúdo rejeitado com sucesso!', 'success');
                navigate('/backoffice/contents');
            }
        }
    };

    const [historyOpen, setHistoryOpen] = useState(true);

    if (content === null) return null;
    return (
        <div className='d-flex flex-column vh-100 bg-light'>
            <header className='bg-black text-white border-bottom border-secondary position-sticky top-0' style={{ zIndex: 10 }}>
                <div className='d-flex' style={{ minHeight: 64 }}>
                    <div className='flex-grow-1 position-relative'>
                        <div className='position-absolute top-50 translate-middle-y ps-4' style={{ zIndex: 1 }}>
                            <Link to='/backoffice/contents' className='d-flex align-items-center text-white text-decoration-none'>
                                <img src={icon} alt='Ícone do DiárioLX' style={{ width: 28, height: 28 }} />
                            </Link>
                        </div>
                        <div className='container px-4 px-md-5 h-100 d-flex align-items-center'>
                            <div
                                className='d-flex align-items-center ps-3 ms-5'
                                style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: 32 }}
                            >
                                <span className='fw-medium' style={{ fontSize: '1rem' }}>{t('common.pending_article')}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className='d-flex align-items-center justify-content-between px-4 flex-shrink-0'
                        style={{ width: 340, borderLeft: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        <div className='d-flex align-items-center gap-2'>
                            <History size={18} />
                            <span style={{ fontSize: '0.9rem' }}>{t('contents.history')}</span>
                        </div>
                        <button
                            type='button'
                            className='btn btn-link text-white d-flex align-items-center p-0 text-decoration-none'
                            onClick={() => setHistoryOpen(o => !o)}
                        >
                            <PanelRightClose size={18} style={{ transform: historyOpen ? 'none' : 'scaleX(-1)' }} />
                        </button>
                    </div>
                </div>
            </header>
            <div className='d-flex flex-grow-1 overflow-hidden'>
                <div className='flex-grow-1 overflow-y-auto'>
                    {content ? (
                        <ContentPreview content={content} />
                    ) : (
                        <div className='d-flex align-items-center justify-content-center h-100 text-muted'>
                            {t('common.loading')}
                        </div>
                    )}
                </div>
                <div
                    className='border-start bg-white overflow-y-auto position-fixed top-0 end-0 bottom-0'
                    style={{
                        width: 340,
                        zIndex: 9,
                        transform: historyOpen ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.25s ease',
                    }}
                >
                    <div
                        className='bg-black text-white d-flex align-items-center justify-content-between'
                        style={{ height: 64, position: 'sticky', top: 0, zIndex: 1 }}
                    >
                        <div
                            className='d-flex align-items-center gap-3 px-4'
                            style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: '100%' }}
                        >
                            <History size={18} />
                            <span className='fw-medium' style={{ fontSize: '0.95rem' }}>{t('contents.history')}</span>
                        </div>
                        <button
                            type='button'
                            className='btn btn-link text-white d-flex align-items-center p-0 text-decoration-none px-4'
                            onClick={() => setHistoryOpen(false)}
                        >
                            <PanelRightClose size={18} />
                        </button>
                    </div>
                    <div className='p-4'>
                        {historyList.length > 0 ? (
                            historyList.map(entry => (
                                <HistoryEntryCard key={entry.id} entry={entry} />
                            ))
                        ) : (
                            <div className='text-muted text-center' style={{ fontSize: '0.85rem' }}>
                                {t('contents.no_history')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                className='position-fixed bottom-0 start-0 end-0 d-flex justify-content-end gap-2 p-3 bg-white border-top'
                style={{ zIndex: 9 }}
            >
                <button
                    type='button'
                    className='btn btn-outline-dark px-4'
                    onClick={() => { 
                        setModalAction('reject'); 
                        setOpenConfirmModal(true); 
                    }}
                >
                    {t('common.reject')}
                </button>
                <button
                    type='button'
                    className='btn btn-dark px-4'
                    onClick={() => { 
                        setModalAction('approve'); 
                        setOpenConfirmModal(true); 
                    }}
                >
                    {t('common.approve')}
                </button>
            </div>
            <ReviewModal
                isOpen={openConfirmModal}
                actionType={modalAction}
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={handleConfirmReview}
            />
        </div>
    );
};