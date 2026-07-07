import { useMemo, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Edit, Archive, ArchiveRestore, Trash, ExternalLink } from 'lucide-react';

import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination, TableBody } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { type Category, useCategories } from '@/shared/hooks/useCategories';
import { useI18n } from '@/shared/hooks/useI18n';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { useFilters } from '@/shared/hooks/useFilters';
import { useAuthentication } from '@/shared/hooks/useAuthentication';

type Props = {
    filter: { archived: boolean };
    openModal: (action: ModalAction | null, category: Category) => void;
};

const CategoriesTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { loading, categories, pagination, fetchAll } = useCategories();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();
    const { user } = useAuthentication();

    const canManageCategories = user?.features?.includes('manage-categories');

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query' }, { archived: filter.archived });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <>
            <Table dataTestId='categories-table'>
                <TableHeader>
                    <TableColumn className='col-lg-5' isHeader={true}>
                        {t('categories.name')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('common.slug')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('categories.hierarchy')}
                    </TableColumn>
                    <TableColumn className='col-lg-1' isHeader={true}>
                        {t('common.count')}
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-center' isHeader={true}>
                        {t('common.actions')}
                    </TableColumn>
                </TableHeader>
                <TableBody cols={5} loading={loading} isEmpty={categories.length === 0} emptyMessage={t('categories.empty_message')}>
                    {categories.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableColumn className='col-lg-5'>
                                <div className='d-flex align-items-center gap-3'>
                                    <div
                                        className='d-flex align-items-center justify-content-center rounded-circle border border-dark flex-shrink-0'
                                        style={{ width: 64, height: 64 }}
                                    >
                                        <div className='rounded-circle' style={{ width: 28, height: 28, backgroundColor: row.color }} />
                                    </div>
                                    <div>
                                        <div className='fw-medium text-dark' style={{ fontSize: '1.1rem' }}>
                                            {row.name}
                                        </div>
                                        <div className='text-muted small mt-1'>
                                            {row.description || '-'}
                                        </div>
                                    </div>
                                </div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('common.slug')}</div>
                                <div className='text-secondary'>{row.slug}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('categories.hierarchy')}</div>
                                <div className='text-secondary'>{row.parentName || t('categories.principal')}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-1'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('common.count')}</div>
                                <div className='text-secondary'>{row.quantity}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    <Link
                                        to={`/c/${row.slug}`}
                                        className='btn btn-outline-dark rounded-2'
                                        data-testid={`visit-category-button-${index}`}
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                    {canManageCategories &&
                                        <>
                                            {row.archivedAt ?
                                                <button onClick={() => openModal('delete', row)} className='btn btn-dark rounded-2'>
                                                    <Trash size={16} />
                                                </button>
                                                :
                                                <Link
                                                    to={`/backoffice/categories/${row.id}`}
                                                    state={{ category: row }}
                                                    className='btn btn-dark rounded-2'
                                                    data-testid={`manage-category-button-${index}`}
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                            }
                                            <button onClick={() => openModal(row.archivedAt ? 'unarchive' : 'archive', row)} className='btn btn-outline-dark rounded-2'>
                                                {row.archivedAt ? <ArchiveRestore size={16} data-testid={`restore-button-${index}`} /> : <Archive size={16} data-testid={`archive-button-${index}`} />}
                                            </button>
                                        </>
                                    }
                                </div>
                            </TableColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {pagination ? <TablePagination hasPrevious={pagination.hasPrevious} hasNext={pagination.hasNext} /> : null}
        </>
    );
}

type ModalAction = 'archive' | 'unarchive' | 'delete';

export const Categories = () => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { archive, unarchive, remove } = useCategories();
    const [open, setOpen] = useState<null | Category>(null);
    const [modalAction, setModalAction] = useState<ModalAction | null>(null);

    const activeFilter = useMemo(() => ({ archived: false }), []);
    const archivedFilter = useMemo(() => ({ archived: true }), []);

    const modalConfig: Record<ModalAction, ModalConfig> = {
        archive: {
            title: t('categories.archive_title'),
            subtitle: t('categories.archive_confirmation'),
            alert: t('categories.archive_alert'),
            confirmLabel: t('common.archive'),
            action: archive,
            getRedirect: () => '/backoffice/categories?tab=archived',
        },
        unarchive: {
            title: t('categories.unarchive_title'),
            subtitle: t('categories.unarchive_confirmation'),
            alert: t('categories.unarchive_alert'),
            confirmLabel: t('common.unarchive'),
            action: unarchive,
            getRedirect: () => '/backoffice/categories?tab=all',
        },
        delete: {
            title: t('categories.delete_title'),
            subtitle: t('categories.delete_confirmation'),
            alert: t('categories.delete_alert'),
            confirmLabel: t('common.delete'),
            action: remove,
            getRedirect: () => `/backoffice/categories?tab=archived&refresh=${Date.now()}`,
            variant: 'danger',
        },
    };

    const closeModal = () => {
        setOpen(null);
        setModalAction(null);
    };

    const { showSnackbar } = useSnackbar();

    const handleConfirm = async () => {
        if (!open || !config) return;
        const res = await config.action(open.id);
        if (!res.ok) {
            showSnackbar(res.error, 'error');
            return;
        }
        closeModal();
        navigate(config.getRedirect());
    };

    const config = modalAction ? modalConfig[modalAction] : undefined;

    return (
        <>
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder={t('categories.search_placeholder')} />
                    </>
                }
            >
                <Tab id='active' label={t('common.active-f')}>
                    <CategoriesTable filter={activeFilter} openModal={(action, category) => { setModalAction(action); setOpen(category); }} />
                </Tab>
                <Tab id='archived' label={t('common.archived')}>
                    <CategoriesTable filter={archivedFilter} openModal={(action, category) => { setModalAction(action); setOpen(category); }} />
                </Tab>
            </Tabs>
            <ConfirmModal
                open={open !== null && config !== undefined}
                onConfirm={handleConfirm}
                config={config}
                name='category'
                closeModal={closeModal}
            />
        </>
    );
}
