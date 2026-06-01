import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Edit, Archive, ArchiveRestore, Trash } from 'lucide-react';

import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableBody, TableHeader, TableColumn, TableRow, TablePagination } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { type FilterSection } from '@/shared/components/table/FiltersDrawer';
import { type Tag, useTags } from '@/shared/hooks/useTags';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';

const sections: FilterSection[] = [];

type Props = {
    filter: { archived: boolean };
    openModal: (action: ModalAction | null, tag: Tag) => void;
};

type ModalAction = 'archive' | 'unarchive' | 'delete';

const TagsTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { loading, tags, pagination, fetchAll } = useTags();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query' }, { archived: filter.archived });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <>
            <Table dataTestId='tags-table' >
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
                <TableBody cols={4} loading={loading} isEmpty={tags.length === 0} emptyMessage='Nenhuma tag encontrada.'>
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
                                <div className='text-secondary'>{row.quantity}</div>
                            </TableColumn>
                            <TableColumn className='col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    {row.archivedAt ?
                                        <button onClick={() => openModal('delete', row)} className='btn btn-dark rounded-2'>
                                            <Trash size={16} />
                                        </button>
                                        :
                                        <Link
                                            to={`/backoffice/tags/${row.id}`}
                                            state={{ tag: row }}
                                            className='btn btn-dark rounded-2'
                                            data-testid={`manage-tag-button-${index}`}
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
            {pagination && <TablePagination hasPrevious={pagination.hasPrevious} hasNext={pagination.hasNext} />}
        </>
    );
}

export const Tags = () => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { archive, unarchive, remove } = useTags();
    const [open, setOpen] = useState<null | Tag>(null);
    const [modalAction, setModalAction] = useState<ModalAction | null>(null);

    const modalConfig: Record<ModalAction, ModalConfig> = {
        archive: {
            title: 'Arquivar etiqueta',
            subtitle: 'Tem a certeza que deseja arquivar esta etiqueta?',
            alert: 'Os conteúdos que têm esta etiqueta como etiqueta principal deixarão de estar visíveis enquanto ela estiver arquivada.',
            confirmLabel: 'Arquivar',
            action: archive,
            getRedirect: () => '/backoffice/tags?tab=archived',
        },
        unarchive: {
            title: 'Desaquivar etiqueta',
            subtitle: 'Tem a certeza que deseja desarquivar esta etiqueta?',
            alert: 'Os conteúdos que têm esta etiqueta como etiqueta principal voltarão a estar visíveis assim que ela for desarquivada.',
            confirmLabel: 'Desarquivar',
            action: unarchive,
            getRedirect: () => '/backoffice/tags?tab=all',
        },
        delete: {
            title: 'Elimiar etiqueta',
            subtitle: 'Tem a certeza que deseja eliminar esta etiqueta?',
            alert: 'Esta ação é permanente e não pode ser revertida.',
            confirmLabel: 'Eliminar',
            action: remove,
            getRedirect: () => `/backoffice/tags?tab=archived&refresh=${Date.now()}`,
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
                        <TableSearch placeholder={t('tags.search_placeholder')} />
                        {sections.length > 0 &&
                            <TableFilters sections={sections} />
                        }
                    </>
                }
            >
                <Tab id='active' label={t('common.active-f')}>
                    <TagsTable filter={{ archived: false }} openModal={(action, tag) => { setModalAction(action); setOpen(tag); }} />
                </Tab>
                <Tab id='archived' label={t('common.archived')}>
                    <TagsTable filter={{ archived: true }} openModal={(action, tag) => { setModalAction(action); setOpen(tag); }} />
                </Tab>
            </Tabs>
            <ConfirmModal
                open={open !== null && config !== undefined}
                onConfirm={handleConfirm}
                config={config}
                name='tag'
                closeModal={closeModal}
            />
        </>
    );
}
