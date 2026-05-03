import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Edit, Archive, ArchiveRestore, Trash } from 'lucide-react';

import { Modal } from '@/shared/components/Modal';
import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { Alert } from '@/shared/components/Alert';
import { type FilterSection } from '@/shared/components/table/FiltersDrawer';
import { type Category, useCategories } from '@/shared/hooks/useCategories';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';

const sections: FilterSection[] = [ // Exemplo
    {
        key: 'estado',
        title: 'ESTADO',
        options: [
            { value: 'pending', label: 'Pendente' },
            { value: 'active', label: 'Ativo' },
            { value: 'inactive', label: 'Inativo' },
        ],
    },
    {
        key: 'tipo',
        title: 'TIPO',
        options: [
            { value: 'administrator', label: 'Administrador' },
            { value: 'collaborator', label: 'Colaborador' },
        ],
    },
    {
        key: 'funcao',
        title: 'FUNÇÃO',
        options: [
            { value: 'journalist', label: 'Jornalista' },
            { value: 'photographer', label: 'Fotógrafo' },
        ],
    },
];

type Props = {
    filter: { archived: boolean };
    openModal: (category: Category) => void;
};

const CategoriesTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { categories, fetchAll } = useCategories();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'limit' }, { archived: filter.archived });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <Table dataTestId='categories-table' isEmpty={categories.length === 0} emptyMessage='Nenhuma categoria encontrada.'>
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
                        <div className='text-secondary'>{row.count}</div>
                    </TableColumn>
                    <TableColumn className='col-6 col-lg-2 text-lg-end'>
                        <div className='d-flex d-lg-flex justify-content-center gap-2'>
                            {row.archivedAt ?
                                <button onClick={() => alert('TO-DO')} className='btn btn-dark rounded-2'>
                                    <Trash size={16} />
                                </button>
                                :
                                <Link
                                    to={`/admin/categorias/${row.id}`}
                                    state={{ category: row }}
                                    className='btn btn-dark rounded-2'
                                    data-testid={`manage-category-button-${index}`}
                                >
                                    <Edit size={16} />
                                </Link>
                            }
                            <button onClick={() => openModal(row)} className='btn btn-outline-dark rounded-2'>
                                {row.archivedAt ? <ArchiveRestore size={16} data-testid={`restore-button-${index}`} /> : <Archive size={16} data-testid={`archive-button-${index}`} />}
                            </button>
                        </div>
                    </TableColumn>
                </TableRow>
            ))}
        </Table>
    );
}

export function Categories() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { archive, unarchive } = useCategories();
    const [open, setOpen] = useState<null | Category>(null);

    const messageModal = open?.archivedAt ? 'Tem a certeza que deseja desarquivar esta categoria?' : 'Tem a certeza que deseja arquivar esta categoria?';
    const alertMessage = open?.archivedAt
        ? 'Os conteúdos associados voltarão a estar visíveis assim que a categoria for desarquivada.'
        : 'Os conteúdos associados deixarão de estar visíveis enquanto a categoria estiver arquivada.';
    const labelModal = open?.archivedAt ? 'Desarquivar' : 'Arquivar';
    const actionModal = open?.archivedAt ? unarchive : archive;
    const redirectAfterAction = open?.archivedAt ? `/admin/categorias?tab=all` : '/admin/categorias?tab=archived';

    return (
        <>
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder={t('categories.search_placeholder')} />
                        <TableFilters sections={sections} />
                    </>
                }
            >
                <Tab id='active' label={t('common.active')}>
                    <CategoriesTable filter={{ archived: false }} openModal={(category) => { setOpen(category); }} />
                    <TablePagination />
                </Tab>
                <Tab id='archived' label={t('common.archived')}>
                    <CategoriesTable filter={{ archived: true }} openModal={(category) => { setOpen(category); }} />
                    <TablePagination />
                </Tab>
            </Tabs>
            <Modal
                isOpen={open !== null}
                title={`${labelModal} categoria`}
                onClose={() => setOpen(null)}
                buttons={[
                    {
                        key: 'cancel',
                        label: 'Cancelar',
                        variant: 'secondary',
                        dataTestId: 'cancel-button',
                        onClick: () => setOpen(null),
                    },
                    {
                        key: 'archive',
                        label: labelModal,
                        variant: 'primary',
                        dataTestId: `confirm-${open?.archivedAt ? 'restore-button' : 'archive-button'}`,
                        onClick: () => actionModal(open!.id).then(() => { setOpen(null); navigate(redirectAfterAction); }),
                    },
                ]}
            >
                <h6 className='mb-3'>{messageModal}</h6>
                <Alert variant='warning' title='Atenção!'>
                    {alertMessage}
                </Alert>
            </Modal>
        </>
    );
}
