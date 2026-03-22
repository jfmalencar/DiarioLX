import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Link } from 'react-router-dom';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { type FilterSection } from '@/shared/components/table/FiltersDrawer';
import { type Category, useCategories } from '@/shared/hooks/useCategories';
import { useI18n } from '@/shared/hooks/useI18n';

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
    rows: Category[];
};

const CategoriesTable = ({ rows }: Props) => {
    const { t } = useI18n();
    return (
        <Table dataTestId='categories-table' isEmpty={rows.length === 0} emptyMessage='Nenhuma categoria encontrada.'>
            <TableHeader>
                <TableColumn className='col-lg-5' isHeader={true}>
                    {t('categories.name')}
                </TableColumn>
                <TableColumn className='col-lg-2' isHeader={true}>
                    {t('categories.slug')}
                </TableColumn>
                <TableColumn className='col-lg-2' isHeader={true}>
                    {t('categories.hierarchy')}
                </TableColumn>
                <TableColumn className='col-lg-1' isHeader={true}>
                    {t('categories.count')}
                </TableColumn>
                <TableColumn className='col-lg-1 text-end' isHeader={true}>
                    {t('categories.actions')}
                </TableColumn>
            </TableHeader>
            {rows.map((row, index) => (
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
                        <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('categories.slug')}</div>
                        <div className='text-secondary'>{row.slug}</div>
                    </TableColumn>
                    <TableColumn className='col-6 col-lg-2'>
                        <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('categories.hierarchy')}</div>
                        <div className='text-secondary'>{row.parentName || 'Principal'}</div>
                    </TableColumn>
                    <TableColumn className='col-4 col-lg-1'>
                        <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('categories.count')}</div>
                        <div className='text-secondary'>{row.count}</div>
                    </TableColumn>
                    <TableColumn className='col-4 col-lg-1 text-lg-end'>
                        <Link
                            to={`/admin/categorias/${row.id}`}
                            state={{ category: row }}
                            className='btn btn-dark px-4 rounded-2'
                            data-testid={`manage-category-button-${index}`}
                        >
                            {t('categories.manage')}
                        </Link>
                    </TableColumn>
                </TableRow>
            ))}
        </Table>
    );
}

export function Categories() {
    const { categories, fetchAll } = useCategories();
    const [searchParams] = useSearchParams();
    const { t } = useI18n();

    useEffect(() => {
        fetchAll()
    }, [fetchAll, searchParams]);

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
                <Tab id='all' label={t('categories.all')}>
                    <CategoriesTable rows={categories} />
                </Tab>
            </Tabs>
        </>
    );
}
