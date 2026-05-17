import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Edit, Archive, ArchiveRestore, Trash } from 'lucide-react';

import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination, TableBody } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { type Category, useCategories } from '@/shared/hooks/useCategories';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';

type Props = {
    filter: { archived: boolean };
    openModal: (action: ModalAction | null, category: Category) => void;
};

const CategoriesTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { loading, categories, pagination, fetchAll } = useCategories();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();

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
                <TableBody cols={5} loading={loading} isEmpty={categories.length === 0} emptyMessage='Nenhuma categoria encontrada.'>
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
                                <div className='text-secondary'>{row.parentName || 'Principal'}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-1'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('common.count')}</div>
                                <div className='text-secondary'>{row.quantity}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    {row.archivedAt ?
                                        <button onClick={() => openModal('delete', row)} className='btn btn-dark rounded-2'>
                                            <Trash size={16} />
                                        </button>
                                        :
                                        <Link
                                            to={`/backoffice/categorias/${row.id}`}
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

    const modalConfig: Record<ModalAction, ModalConfig> = {
        archive: {
            title: 'Arquivar categoria',
            subtitle: 'Tem a certeza que deseja arquivar esta categoria?',
            alert: 'Os conteúdos associados deixarão de estar visíveis enquanto a categoria estiver arquivada.',
            confirmLabel: 'Arquivar',
            action: archive,
            getRedirect: () => '/backoffice/categorias?tab=archived',
        },
        unarchive: {
            title: 'Desaquivar categoria',
            subtitle: 'Tem a certeza que deseja desarquivar esta categoria?',
            alert: 'Os conteúdos associados voltarão a estar visíveis assim que a categoria for desarquivada.',
            confirmLabel: 'Desarquivar',
            action: unarchive,
            getRedirect: () => '/backoffice/categorias?tab=all',
        },
        delete: {
            title: 'Elimiar categoria',
            subtitle: 'Tem a certeza que deseja eliminar esta categoria?',
            alert: 'Esta ação é permanente e não pode ser revertida.',
            confirmLabel: 'Eliminar',
            action: remove,
            getRedirect: () => `/backoffice/categorias?tab=archived&refresh=${Date.now()}`,
            variant: 'danger',
        },
    };

    const closeModal = () => {
        setOpen(null);
        setModalAction(null);
    };

    const handleConfirm = () => {
        if (!open || !config) return;
        config.action(open.id).then(() => { closeModal(); navigate(config.getRedirect()); });
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
                    <CategoriesTable filter={{ archived: false }} openModal={(action, category) => { setModalAction(action); setOpen(category); }} />
                </Tab>
                <Tab id='archived' label={t('common.archived')}>
                    <CategoriesTable filter={{ archived: true }} openModal={(action, category) => { setModalAction(action); setOpen(category); }} />
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
