import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { CheckCircle, XCircle, History, PanelRightClose } from 'lucide-react';

import { ContentPreview } from '@/shared/components/ContentPreview';
import { type Content, useContents } from '@/shared/hooks/useContents';
import { useSnackbar } from '@/shared/hooks/useSnackbar';

import icon from '@/assets/icon.svg';

import { PublishModal } from './PublishModal';

type HistoryEntryType = 'change-approved' | 'change-rejected' | 'publish-approved' | 'publish-rejected';

type HistoryEntry = {
    id: string;
    type: HistoryEntryType;
    date: string;
    by: string;
    excerpt?: string;
    comment?: string;
};

const MOCK_HISTORY: HistoryEntry[] = [
    {
        id: '1',
        type: 'change-approved',
        date: '02.10.2024',
        by: 'ALEXANDRA CENTENO',
        excerpt: '"mesas rústicas de madeira, com toalhas de tecido e um conjunto completo de talheres"',
    },
    {
        id: '2',
        type: 'change-rejected',
        date: '02.10.2024',
        by: 'ALEXANDRA CENTENO',
        excerpt: '"S. José, perto da Avenida da Liberdade, em Lisboa"',
        comment: 'Informação precisa de ser verificada.',
    },
    {
        id: '3',
        type: 'publish-approved',
        date: '02.10.2024',
        by: 'ALEXANDRA CENTENO',
    },
    {
        id: '4',
        type: 'publish-rejected',
        date: '02.10.2024',
        by: 'ALEXANDRA CENTENO',
        comment: 'Existem os seguintes erros ortográficos: ... e inconsistências na estrutura dos parágrafos x e y.',
    },
];

const historyConfig: Record<HistoryEntryType, { label: string; sublabel: string; sublabelColor: string; icon: typeof CheckCircle; iconColor: string }> = {
    'change-approved': { label: 'ALTERAÇÃO', sublabel: 'APROVADA', sublabelColor: '#2d6a4f', icon: CheckCircle, iconColor: '#2d6a4f' },
    'change-rejected': { label: 'ALTERAÇÃO', sublabel: 'REJEITADA', sublabelColor: '#9b2335', icon: XCircle, iconColor: '#9b2335' },
    'publish-approved': { label: 'PUBLICAÇÃO', sublabel: 'APROVADA', sublabelColor: '#2d6a4f', icon: CheckCircle, iconColor: '#2d6a4f' },
    'publish-rejected': { label: 'PUBLICAÇÃO', sublabel: 'REJEITADA', sublabelColor: '#9b2335', icon: XCircle, iconColor: '#9b2335' },
};

const HistoryEntryCard = ({ entry }: { entry: HistoryEntry }) => {
    const config = historyConfig[entry.type];
    const Icon = config.icon;

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
                <span className='text-muted' style={{ fontSize: '0.75rem' }}>{entry.date}</span>
            </div>
            {entry.excerpt && (
                <div
                    className='rounded p-2 mb-2'
                    style={{ backgroundColor: '#f5f5f5', fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}
                >
                    {entry.excerpt}
                </div>
            )}
            {entry.comment && (
                <div className='mb-2' style={{ fontSize: '0.85rem', color: '#333' }}>
                    {entry.comment}
                </div>
            )}
            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                POR <strong>{entry.by}</strong>
            </div>
        </div>
    );
};

export const ReviewContent = () => {
    const params = useParams()
    const navigate = useNavigate();
    const { fetchById, publish } = useContents();
    const [content, setContent] = useState<Content | null>(null)
    const [openConfirmaModal, setOpenConfirmModal] = useState<boolean>(false);
    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        const load = async () => {
            if (params.id && params.id !== 'new') {
                await fetchById(Number(params.id)).then((content) => {
                    if (content && content.state !== 'PENDING_REVIEW') {
                        navigate('/backoffice/contents')
                    }
                    if (content) {
                        setContent(content)
                    }
                });
            }
        }
        load();
    }, [fetchById, params.id, navigate]);

    const handleApprove = async () => {
        const result = await publish(Number(params.id))
        if (result) {
            showSnackbar('Conteúdo publicado com sucesso!', 'success');
            navigate('/p/' + content?.slug)
        } else {
            showSnackbar('Algo deu errado. Tente novamente')
        }
    }

    const [historyOpen, setHistoryOpen] = useState(true);

    if (content === null) return null
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
                                <span className='fw-medium' style={{ fontSize: '1rem' }}>Artigo pendente</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className='d-flex align-items-center justify-content-between px-4 flex-shrink-0'
                        style={{ width: 340, borderLeft: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        <div className='d-flex align-items-center gap-2'>
                            <History size={18} />
                            <span style={{ fontSize: '0.9rem' }}>Histórico</span>
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
                            A carregar...
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
                            <span className='fw-medium' style={{ fontSize: '0.95rem' }}>Histórico</span>
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
                        {MOCK_HISTORY.map(entry => (
                            <HistoryEntryCard key={entry.id} entry={entry} />
                        ))}
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
                    onClick={() => {/* handleReject */ }}
                >
                    Rejeitar
                </button>
                <button
                    type='button'
                    className='btn btn-dark px-4'
                    onClick={() => setOpenConfirmModal(true)}
                >
                    Aprovar
                </button>
            </div>
            <PublishModal
                isOpen={openConfirmaModal}
                onClose={() => setOpenConfirmModal(false)}
                content={{
                    title: content.title,
                    category: content.category.name,
                    featured: content.featuredImage,
                    authors: content.authors.map((a) => a.name),
                }}
                onPublish={() => handleApprove()}
            />
        </div>
    );
};
