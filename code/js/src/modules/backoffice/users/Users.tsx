import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { UserIcon, Trash, UserX, UserCheck, MoreHorizontal, ExternalLink } from 'lucide-react';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination, TableBody } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { useUsers, type User } from '@/shared/hooks/useUsers';
import { useI18n } from '@/shared/hooks/useI18n';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { useFilters } from '@/shared/hooks/useFilters';
import { usePath } from '@/shared/hooks/usePath';
import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { RoleBadge } from '@/shared/components/RoleBadge';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { UserPreviewModal } from './UserPreviewModal';
import type { FilterSection } from '@/shared/components/table/FiltersDrawer';

type Props = {
    filter: { deactivated: boolean };
    openModal: (action: ModalAction | null, user: User) => void;
};

type ModalAction = 'deactivate' | 'delete' | 'activate';

const UsersTable = ({ filter, openModal }: Props) => {
    const { t } = useI18n();
    const { loading, users, pagination, fetchAll } = useUsers();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();
    const { buildMediaUrl } = usePath();
    const { user } = useAuthentication();

    const canManageUsers = user?.features?.includes('manage-users');

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query', role: 'role', refresh: 'refresh' }, { deactivated: filter.deactivated });
        fetchAll(params);
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <>
            <Table dataTestId='users-table'>
                <TableHeader>
                    <TableColumn className='col-lg-4' isHeader={true}>
                        {t('users.name')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('users.username')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('users.email')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('users.role')}
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-center' isHeader={true}>
                        {t('common.actions')}
                    </TableColumn>
                </TableHeader>
                <TableBody cols={5} loading={loading} isEmpty={users.length === 0} emptyMessage={t('users.empty_message')}>
                    {users.map((row, index) => (
                        <TableRow key={row.userId}>
                            <TableColumn className='col-lg-4'>
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
                                            <img
                                                src={'https://placehold.co/213x213/black/white?text=' + (row.firstName?.charAt(0).toUpperCase() || 'U')}
                                                alt={`${row.firstName} ${row.lastName}`}
                                                className='rounded-circle'
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        }
                                    </div>
                                    <div>
                                        <div className='fw-medium text-dark' style={{ fontSize: '1.1rem' }}>
                                            {row.firstName} {row.lastName}
                                        </div>
                                        <div className='text-muted small mt-1'>
                                            {row.position || '-'}
                                        </div>
                                    </div>
                                </div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.username')}</div>
                                <div className='text-secondary'>{row.username}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.email')}</div>
                                <div className='text-secondary'>{row.email}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.role')}</div>
                                <RoleBadge role={row.role} />
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex justify-content-center align-items-center gap-2'>
                                    {canManageUsers ? (
                                        <>
                                            <button
                                                onClick={() => openModal(null, row)}
                                                className='btn btn-outline-secondary rounded-2'
                                                title={t('users.preview_tooltip')}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>

                                            {row.isActive ? (
                                                <button onClick={() => openModal('deactivate', row)} className='btn btn-dark rounded-2' title={t('users.deactivate_tooltip')}>
                                                    <UserX size={16} />
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => openModal('activate', row)} className='btn btn-success rounded-2' title={t('users.activate_tooltip')}>
                                                        <UserCheck size={16} />
                                                    </button>
                                                    <button onClick={() => openModal('delete', row)} className='btn btn-dark rounded-2' title={t('users.delete_tooltip')}>
                                                        <Trash size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to={`/a/${row.username}`}
                                            className='btn btn-outline-dark rounded-2'
                                            data-testid={`visit-author-button-${index}`}
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    )}
                                </div>
                            </TableColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {pagination && <TablePagination hasPrevious={pagination.hasPrevious} hasNext={pagination.hasNext} />}
        </>
    );
};

export function Users() {
    const { t } = useI18n();
    const { remove, deactivate, activate } = useUsers();
    const [open, setOpen] = useState<null | User>(null);
    const [modalAction, setModalAction] = useState<ModalAction | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuthentication();

    const deactivatedTrue = useMemo(() => ({ deactivated: true }), []);
    const deactivatedFalse = useMemo(() => ({ deactivated: false }), []);
    const canManageUsers = user?.features?.includes('manage-users');

    const sections: FilterSection[] = [
        {
            key: 'role',
            title: t('users.type_filter'),
            options: [
                { value: 'ADMIN', label: t('users.admin') },
                { value: 'CONTRIBUTOR', label: t('users.contributor') },
                { value: 'EDITOR', label: t('users.editor') },
            ],
        }
    ];

    const modalConfig: Record<ModalAction, ModalConfig> = {
        deactivate: {
            title: t('users.deactivate_title'),
            subtitle: t('users.deactivate_confirmation'),
            alert: t('users.deactivate_alert'),
            confirmLabel: t('common.deactivate'),
            action: deactivate,
            getRedirect: () => '/backoffice/users?tab=deactivated',
        },
        delete: {
            title: t('users.delete_title'),
            subtitle: t('users.delete_confirmation'),
            alert: t('users.delete_alert'),
            confirmLabel: t('common.delete'),
            action: remove,
            getRedirect: () => `/backoffice/users?tab=deactivated&refresh=${Date.now()}`,
            variant: 'danger',
        },
        activate: {
            title: t('users.activate_title'),
            subtitle: t('users.activate_confirmation'),
            alert: t('users.activate_alert'),
            confirmLabel: t('common.activate'),
            action: activate,
            getRedirect: () => '/backoffice/users?tab=active',
        },
    };

    const closeModal = () => {
        setOpen(null);
        setModalAction(null);
    };

    const { showSnackbar } = useSnackbar();

    const handleConfirm = async () => {
        if (!open || !config) return;
        const res = await config.action(open.userId);
        if (!res.ok) {
            showSnackbar(res.error, 'error');
            return;
        }
        closeModal();
        navigate(config.getRedirect());
    };

    const handleOpenModal = (action: ModalAction | null, user: User) => {
        setOpen(user);
        if (action) {
            setModalAction(action);
            setIsPreviewOpen(false);
        } else {
            setModalAction(null);
            setIsPreviewOpen(true);
        }
    };

    const handleRefreshData = () => {
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set('refresh', Date.now().toString());
        navigate(`${window.location.pathname}?${currentParams.toString()}`, { replace: true });
    };

    const config = modalAction ? modalConfig[modalAction] : undefined;

    return (
        <>
            {canManageUsers && (
                <div className='d-flex justify-content-end mb-3'>
                    <button 
                        onClick={() => navigate('/backoffice/users/reset-requests')}
                        className='btn btn-dark rounded-0 px-4'
                    >
                        {t('users.view_reset_requests')}
                    </button>
                </div>
            )}

            <Tabs toolbar={<><TableSearch placeholder={t('categories.search_placeholder')} /><TableFilters sections={sections} /></>}>
                <Tab id='active' label={t('common.active-m')}>
                    <UsersTable filter={deactivatedFalse} openModal={handleOpenModal} />
                </Tab>
                <Tab id='deactivated' label={t('common.deactivated')}>
                    <UsersTable filter={deactivatedTrue} openModal={handleOpenModal} />
                </Tab>
            </Tabs>

            <ConfirmModal
                open={!!open && !!modalAction}
                onConfirm={() => handleConfirm()}
                config={config}
                name='invite'
                closeModal={closeModal}
            />

            <UserPreviewModal
                user={open}
                isOpen={isPreviewOpen}
                onClose={() => { setIsPreviewOpen(false); setOpen(null); }}
                onSuccess={handleRefreshData}
            />
        </>
    );
}