import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { UserIcon, Trash, UserX } from 'lucide-react';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination, TableBody } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { type FilterSection } from '@/shared/components/table/FiltersDrawer';
import { useUsers, type User } from '@/shared/hooks/useUsers';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';
import { usePath } from '@/shared/hooks/usePath';
import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { useAuthentication } from '@/shared/hooks/useAuthentication';

const sections: FilterSection[] = [
    {
        key: 'role',
        title: 'TIPO',
        options: [
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'CONTRIBUTOR', label: 'Colaborador' },
            { value: 'EDITOR', label: 'Editor' },
        ],
    }
];

type Props = {
    filter: { deactivated: boolean };
    openModal: (action: ModalAction | null, user: User) => void;
};

type ModalAction = 'deactivate' | 'delete';

const UsersTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { loading, users, pagination, fetchAll } = useUsers();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();
    const { buildMediaUrl } = usePath();
    const { user } = useAuthentication();

    const canManageUsers = user?.features?.includes('manage-users');

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query', role: 'role' }, { deactivated: filter.deactivated });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <>
            <Table dataTestId='users-table'>
                <TableHeader>
                    <TableColumn className='col-lg-5' isHeader={true}>
                        {t('users.name')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('users.username')}
                    </TableColumn>
                    <TableColumn className='col-lg-3' isHeader={true}>
                        {t('users.email')}
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-center' isHeader={true}>
                        {t('common.actions')}
                    </TableColumn>
                </TableHeader>
                <TableBody cols={4} loading={loading} isEmpty={users.length === 0} emptyMessage='Nenhum usuário encontrado.'>
                    {users.map((row) => (
                        <TableRow key={row.userId}>
                            <TableColumn className='col-lg-5'>
                                <div className='d-flex align-items-center gap-3'>
                                    <div
                                        className='d-flex align-items-center justify-content-center rounded-circle border border-dark flex-shrink-0'
                                        style={{ width: 64, height: 64 }}
                                    >
                                        {row.profilePicturePath ?
                                            <img src={buildMediaUrl(row.profilePicturePath)}
                                                alt={`${row.firstName} ${row.lastName}`}
                                                className='rounded-circle'
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            /> :
                                            <UserIcon size={32} />
                                        }
                                    </div>
                                    <div>
                                        <div className='fw-medium text-dark' style={{ fontSize: '1.1rem' }}>
                                            {row.firstName} {row.lastName}
                                        </div>
                                        <div className='text-muted small mt-1'>
                                            {row.bio || '-'}
                                        </div>
                                    </div>
                                </div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.username')}</div>
                                <div className='text-secondary'>{row.username}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-3'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.email')}</div>
                                <div className='text-secondary'>{row.email}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    {canManageUsers &&
                                        <>
                                            {row.isActive ?
                                                <button onClick={() => openModal('deactivate', row)} className='btn btn-dark rounded-2'>
                                                    <UserX size={16} />
                                                </button> :
                                                <button onClick={() => openModal('delete', row)} className='btn btn-dark rounded-2'>
                                                    <Trash size={16} />
                                                </button>

                                            }
                                        </>
                                    }
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

export function Users() {
    const { t } = useI18n();
    const { remove, deactivate } = useUsers();
    const [open, setOpen] = useState<null | User>(null);
    const [modalAction, setModalAction] = useState<ModalAction | null>(null);
    const navigate = useNavigate();

    const deactivatedTrue = useMemo(() => ({ deactivated: true }), []);
    const deactivatedFalse = useMemo(() => ({ deactivated: false }), []);

    const modalConfig: Record<ModalAction, ModalConfig> = {
        deactivate: {
            title: 'Desativar utilizador',
            subtitle: 'Tem a certeza que deseja desativar este utilizador?',
            alert: 'O utilizador perderá o acesso à plataforma, mas os seus conteúdos publicados permanecerão visíveis.',
            confirmLabel: 'Desativar',
            action: deactivate,
            getRedirect: () => '/backoffice/users?tab=deactivated',
        },
        delete: {
            title: 'Eliminar utilizador',
            subtitle: 'Tem a certeza que deseja eliminar este utilizador?',
            alert: 'Só é possível eliminar utilizadores sem conteúdos publicados. Esta ação é permanente e não pode ser revertida.',
            confirmLabel: 'Eliminar',
            action: remove,
            getRedirect: () => `/backoffice/users?tab=deactivated&refresh=${Date.now()}`,
            variant: 'danger',
        },
    };

    const closeModal = () => {
        setOpen(null);
        setModalAction(null);
    };

    const handleConfirm = () => {
        if (!open || !config) return;
        config.action(open.userId).then(() => { closeModal(); navigate(config.getRedirect()); });
    };

    const config = modalAction ? modalConfig[modalAction] : undefined;

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
                <Tab id='active' label={t('common.active-m')}>
                    <UsersTable filter={deactivatedFalse} openModal={(action, user) => { setModalAction(action); setOpen(user); }} />
                </Tab>
                <Tab id='deactivated' label={t('common.deactivated')}>
                    <UsersTable filter={deactivatedTrue} openModal={(action, user) => { setModalAction(action); setOpen(user); }} />
                </Tab>
            </Tabs>
            <ConfirmModal
                open={!!open}
                onConfirm={() => handleConfirm()}
                config={config}
                name='invite'
                closeModal={() => setOpen(null)}
            />
        </>
    );
}
