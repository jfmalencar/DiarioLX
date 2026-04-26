import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Edit, Archive, ArchiveRestore, Trash } from 'lucide-react';

import { Modal } from '@/shared/components/Modal';
import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { Alert } from '@/shared/components/Alert';
import { type FilterSection } from '@/shared/components/table/FiltersDrawer';
import { type Tag, useTags } from '@/shared/hooks/useTags';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';

const sections: FilterSection[] = [];

type Props = {
    filter: { archived: boolean };
    openModal: (tag: Tag) => void;
};

const TagsTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { tags, fetchAll } = useTags();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'limit' }, { archived: filter.archived });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <Table dataTestId='tags-table' isEmpty={tags.length === 0} emptyMessage='Nenhuma tag encontrada.'>
            <TableHeader>
                <TableColumn className='col-lg-5' isHeader={true}>
                    {t('tags.name')}
                </TableColumn>
                <TableColumn className='col-lg-3' isHeader={true}>
                    {t('common.slug')}
                </TableColumn>
                <TableColumn className='col-lg-2' isHeader={true}>
                    {t('common.count')}
                </TableColumn>
                <TableColumn className='col-lg-2 text-center' isHeader={true}>
                    {t('common.actions')}
                </TableColumn>
            </TableHeader>
            {tags.map((row, index) => (
                <TableRow key={row.id}>
                    <TableColumn className='col-lg-5'>
                        <div className='d-flex align-items-center gap-3'>
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
                    <TableColumn className='col-6 col-lg-3'>
                        <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('common.slug')}</div>
                        <div className='text-secondary'>{row.slug}</div>
                    </TableColumn>
                    <TableColumn className='col-6 col-lg-2'>
                        <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('common.count')}</div>
                        <div className='text-secondary'>{row.count}</div>
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-lg-end'>
                        <div className='d-flex d-lg-flex justify-content-center gap-2'>
                            {row.archivedAt ?
                                <button onClick={() => alert('TO-DO')} className='btn btn-dark rounded-2'>
                                    <Trash size={16} />
                                </button>
                                :
                                <Link
                                    to={`/admin/etiquetas/${row.id}`}
                                    state={{ tag: row }}
                                    className='btn btn-dark rounded-2'
                                    data-testid={`manage-tag-button-${index}`}
                                >
                                    <Edit size={16} />
                                </Link>
                            }
                            <button onClick={() => openModal(row)} className='btn btn-outline-dark rounded-2'>
                                {row.archivedAt ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                            </button>
                        </div>
                    </TableColumn>
                </TableRow>
            ))}
        </Table>
    );
}

export function Tags() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { archive, unarchive } = useTags();
    const [open, setOpen] = useState<null | Tag>(null);

    const messageModal = open?.archivedAt ? 'Tem a certeza que deseja desarquivar esta etiqueta?' : 'Tem a certeza que deseja arquivar esta etiqueta?';
    const alertMessage = open?.archivedAt
        ? 'Os conteúdos que têm esta etiqueta como etiqueta principal voltarão a estar visíveis assim que ela for desarquivada.'
        : 'Os conteúdos que têm esta etiqueta como etiqueta principal deixarão de estar visíveis enquanto ela estiver arquivada.';
    const labelModal = open?.archivedAt ? 'Desarquivar' : 'Arquivar';
    const actionModal = open?.archivedAt ? unarchive : archive;
    const redirectAfterAction = open?.archivedAt ? `/admin/etiquetas?tab=all` : '/admin/etiquetas?tab=archived';

    return (
        <>
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder={t('tags.search_placeholder')} />
                        {sections.length > 0 &&
                            <TableFilters sections={sections} />
                        }
                    </>
                }
            >
                <Tab id='active' label={t('common.active')}>
                    <TagsTable filter={{ archived: false }} openModal={(tag) => { setOpen(tag); }} />
                </Tab>
                <Tab id='archived' label={t('common.archived')}>
                    <TagsTable filter={{ archived: true }} openModal={(tag) => { setOpen(tag); }} />
                </Tab>
            </Tabs>
            <Modal
                isOpen={open !== null}
                title={`${labelModal} etiqueta`}
                onClose={() => setOpen(null)}
                buttons={[
                    {
                        key: 'cancel',
                        label: 'Cancelar',
                        variant: 'secondary',
                        onClick: () => setOpen(null),
                    },
                    {
                        key: 'archive',
                        label: labelModal,
                        variant: 'primary',
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
