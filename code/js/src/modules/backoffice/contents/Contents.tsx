import { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router';
import { ExternalLink, Images, Edit, ClipboardCheck, ClipboardList, FileText, CirclePlay, Mic, AudioLines, Archive, ArchiveRestore, Trash2, ImageOff } from 'lucide-react';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { TableBody, Table, TableHeader, TableColumn, TableRow, TablePagination } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { useContents, type ContentState } from '@/shared/hooks/useContents';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters, type FilterSection } from '@/shared/hooks/useFilters';
import { MediaPreview } from '@/shared/components/MediaPreview';
import { contentThumbnail, isVideoThumbnail } from '@/shared/utils/content';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useSnackbar } from '@/shared/hooks/useSnackbar';

import { formatDate } from '@/shared/utils/format';

const typeIcon = {
    ARTICLE: <FileText size={14} className='text-muted' />,
    VIDEO: <CirclePlay size={14} className='text-muted' />,
    EPISODE: <Mic size={14} className='text-muted' />,
    PODCAST: <AudioLines size={14} className='text-muted' />,
    PHOTO_ESSAY: <Images size={14} className='text-muted' />,
};

type Props = {
    filter: {
        state?: ContentState
        archived?: boolean
    };
};

const ContentsTable = ({ filter }: Props) => {
    const { t } = useI18n();
    const { loading, contents, pagination, fetchAll, archive, unarchive, delete: deleteContent } = useContents();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();
    const { user } = useAuthentication();
    const { showSnackbar } = useSnackbar();

    const canEditPublished = user?.features?.includes('edit-published')
    const isArchivedTab = !!filter.archived

    const refetch = useCallback(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query', type: 'type' }, { state: filter.state, archived: filter.archived });
        fetchAll(params)
    }, [fetchAll, buildQuery, filter.state, filter.archived]);

    useEffect(() => {
        refetch()
    }, [refetch, searchParams]);

    type RowAction = 'archive' | 'unarchive' | 'delete';
    const [modalAction, setModalAction] = useState<RowAction | null>(null);
    const [modalId, setModalId] = useState<number | null>(null);

    const modalConfig: Record<RowAction, ModalConfig> = {
        archive: {
            title: t('contents.archive_title'),
            subtitle: t('contents.archive_confirmation'),
            alert: t('contents.archive_alert'),
            confirmLabel: t('common.archive'),
            action: archive,
            getRedirect: () => '',
        },
        unarchive: {
            title: t('contents.unarchive_title'),
            subtitle: t('contents.unarchive_confirmation'),
            alert: t('contents.unarchive_alert'),
            confirmLabel: t('common.unarchive'),
            action: unarchive,
            getRedirect: () => '',
        },
        delete: {
            title: t('contents.delete_title'),
            subtitle: t('contents.delete_confirm'),
            alert: t('contents.delete_alert'),
            confirmLabel: t('common.delete'),
            action: deleteContent,
            getRedirect: () => '',
            variant: 'danger',
        },
    };

    const successKey: Record<RowAction, string> = {
        archive: 'contents.archived_success',
        unarchive: 'contents.unarchived_success',
        delete: 'contents.deleted_success',
    };

    const config = modalAction ? modalConfig[modalAction] : undefined;
    const openModal = (action: RowAction, id: number) => { setModalAction(action); setModalId(id); };
    const closeModal = () => { setModalAction(null); setModalId(null); };

    const handleConfirm = async () => {
        if (modalId === null || !modalAction || !config) return;
        const res = await config.action(modalId);
        if (!res.ok) { showSnackbar(res.error, 'error'); return; }
        showSnackbar(t(successKey[modalAction]), 'success');
        closeModal();
        refetch();
    };

    return (
        <>
            <Table dataTestId='contents-table' >
                <TableHeader>
                    <TableColumn className='col-lg-5' isHeader={true}>
                        {t('contents.column.publication')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('contents.column.created')}
                    </TableColumn>
                    <TableColumn className='col-lg-3' isHeader={true}>
                        {t('contents.column.authors')}
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-center' isHeader={true}>
                        {t('common.actions')}
                    </TableColumn>
                </TableHeader>
                <TableBody cols={4} loading={loading} isEmpty={contents.length === 0} emptyMessage={t('contents.empty_message')}>
                    {contents.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableColumn className='col-lg-5'>
                                <div className='d-flex align-items-center gap-3'>
                                    <div
                                        className='d-flex align-items-center justify-content-center border border-dark flex-shrink-0'
                                        style={{ width: 90, height: 60, overflow: 'hidden', backgroundColor: '#f0f0f0' }}
                                    >
                                        {contentThumbnail(row) ? (
                                            <MediaPreview
                                                src={contentThumbnail(row)}
                                                isVideo={isVideoThumbnail(row)}
                                                alt={row.title}
                                                className='w-100 h-100'
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        ) : (
                                            <div className='d-flex align-items-center justify-content-center w-100 h-100 text-muted'>
                                                <ImageOff size={14} className='text-muted' />
                                            </div>
                                        )}
                                    </div>
                                    <div className='d-flex align-items-center gap-2'>
                                        {typeIcon[row.type]}
                                        <div className='fw-medium text-dark me-2' style={{ fontSize: '1.1rem' }}>
                                            {row.title}
                                        </div>
                                    </div>
                                </div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('contents.column.created')}</div>
                                <div className='text-secondary'>{formatDate(new Date(row.createdAt), true)}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-3'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('contents.column.authors')}</div>
                                <div className='text-secondary'>{row.authors.map(author => author.name).join(', ')}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    {isArchivedTab ? (
                                        <>
                                            {row.state === 'PUBLISHED' &&
                                                <Link to={`/p/${row.slug}`} target='_blank' className='btn btn-outline-dark rounded-2'>
                                                    <ExternalLink size={16} />
                                                </Link>
                                            }
                                            {canEditPublished &&
                                                <button
                                                    type='button'
                                                    onClick={() => openModal('unarchive', row.id)}
                                                    className='btn btn-outline-dark rounded-2'
                                                    title={t('common.unarchive')}
                                                    disabled={loading}
                                                >
                                                    <ArchiveRestore size={16} />
                                                </button>
                                            }
                                            {canEditPublished &&
                                                <button
                                                    type='button'
                                                    onClick={() => openModal('delete', row.id)}
                                                    className='btn btn-outline-danger rounded-2'
                                                    title={t('common.delete')}
                                                    disabled={loading}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {row.state === 'PUBLISHED' &&
                                                <Link to={`/p/${row.slug}`} target='_blank' className='btn btn-outline-dark rounded-2'>
                                                    <ExternalLink size={16} />
                                                </Link>
                                            }
                                            {(row.state !== 'PUBLISHED' || canEditPublished) &&
                                                <Link
                                                    to={`/backoffice/contents/${row.id}`}
                                                    className='btn btn-dark rounded-2'
                                                    data-testid={`manage-content-button-${index}`}
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                            }
                                            {row.state === 'PENDING_REVIEW' &&
                                                <Link
                                                    to={`/backoffice/contents/${row.id}/review`}
                                                    className='btn btn-outline-dark rounded-2'
                                                >
                                                    <ClipboardCheck size={16} />
                                                </Link>
                                            }
                                            {row.state === 'REJECTED' &&
                                                <Link
                                                    to={`/backoffice/contents/${row.id}/review`}
                                                    className='btn btn-outline-dark rounded-2'
                                                >
                                                    <ClipboardList size={16} />
                                                </Link>
                                            }
                                            {canEditPublished && row.state === 'PUBLISHED' &&
                                                <button
                                                    type='button'
                                                    onClick={() => openModal('archive', row.id)}
                                                    className='btn btn-outline-dark rounded-2'
                                                    title={t('common.archive')}
                                                    disabled={loading}
                                                >
                                                    <Archive size={16} />
                                                </button>
                                            }
                                            {canEditPublished && row.state !== 'PUBLISHED' &&
                                                <button
                                                    type='button'
                                                    onClick={() => openModal('delete', row.id)}
                                                    className='btn btn-outline-danger rounded-2'
                                                    title={t('common.delete')}
                                                    disabled={loading}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            }
                                        </>
                                    )}
                                </div>
                            </TableColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {pagination && <TablePagination hasPrevious={pagination.hasPrevious} hasNext={pagination.hasNext} />}
            <ConfirmModal
                open={modalId !== null && config !== undefined}
                onConfirm={handleConfirm}
                config={config}
                name='content'
                closeModal={closeModal}
            />
        </>
    );
}

export const Contents = () => {
    const { t } = useI18n();

    const sections: FilterSection[] = [
        {
            key: 'type',
            title: t('contents.filter.type'),
            options: [
                { value: 'VIDEO', label: t('contents.type.video') },
                { value: 'ARTICLE', label: t('contents.type.article') },
                { value: 'EPISODE', label: t('contents.type.episode') },
                { value: 'PODCAST', label: t('contents.type.podcast') },
                { value: 'PHOTO_ESSAY', label: t('type.photos') },
            ],
        }
    ];

    return (
        <>
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder={t('contents.search_placeholder')} />
                        <TableFilters sections={sections} />
                    </>
                }
            >
                <Tab id='published' label={t('common.published')}>
                    <ContentsTable filter={{ state: 'PUBLISHED', archived: false }} />
                </Tab>
                <Tab id='pending' label={t('common.pending')}>
                    <ContentsTable filter={{ state: 'PENDING_REVIEW', archived: false }} />
                </Tab>
                <Tab id='draft' label={t('common.draft')}>
                    <ContentsTable filter={{ state: 'DRAFT', archived: false }} />
                </Tab>
                <Tab id='rejected' label={t('common.rejected')}>
                    <ContentsTable filter={{ state: 'REJECTED', archived: false }} />
                </Tab>
                <Tab id='archived' label={t('common.archived')}>
                    <ContentsTable filter={{ archived: true }} />
                </Tab>
            </Tabs>
        </>
    );
}
