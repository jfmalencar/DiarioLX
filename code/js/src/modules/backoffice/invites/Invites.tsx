import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { UserPen, ShieldUser, Trash, UserRoundCheck } from 'lucide-react';

import type { UserRole } from '@/shared/services/users/users.types';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination, TableBody } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { useInvites, type Invite } from '@/shared/hooks/useInvites';
import { useI18n } from '@/shared/hooks/useI18n';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { useFilters } from '@/shared/hooks/useFilters';

import { Button } from '@/shared/components/Button';
import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';

type Props = {
    filter: { expired: boolean };
    remove: (invite: Invite) => void;
};

const OPACITY = 25
const COLORS = {
    CONTRIBUTOR: '#006eff',
    EDITOR: '#179b00',
    ADMIN: '#6a00ff',
}

const RoleCard = ({ role, title, description, icon, onGenerate }: { role: UserRole, title: string, description: string, icon: React.ReactNode, onGenerate: () => void }) => {
    const { t } = useI18n();
    return (
        <div className='card border-0 shadow-sm h-100 rounded-4'>
            <div className='card-body d-flex flex-column'>
                <div className='d-flex mb-4'>
                    <div
                        className='d-flex align-items-center justify-content-center rounded-4 me-3'
                        style={{
                            minWidth: 56,
                            height: 56,
                            backgroundColor: `${COLORS[role]}${OPACITY}`,
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <h5 className='fw-semibold mb-1'>{title}</h5>
                        <small className='text-muted'>
                            {description}
                        </small>
                    </div>
                </div>
                <div className='mt-auto d-flex justify-content-end'>
                    <Button onClick={onGenerate} className='w-100'>{t('invites.generate')}</Button>
                </div>
            </div>
        </div>
    )
}

const InvitesTable = ({ filter, remove }: Props) => {
    const { t } = useI18n();
    const { loading, invites, pagination, fetchAll } = useInvites();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query' }, { expired: filter.expired });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <>
            <Table dataTestId='invites-table'>
                <TableHeader>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('invites.code')}
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        {t('users.role')}
                    </TableColumn>
                    <TableColumn className='col-lg-3' isHeader={true}>
                        {t('invites.created_at')}
                    </TableColumn>
                    <TableColumn className='col-lg-3' isHeader={true}>
                        {t('invites.expires_at')}
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-center' isHeader={true}>
                        {t('common.actions')}
                    </TableColumn>
                </TableHeader>
                <TableBody cols={5} loading={loading} isEmpty={invites.length === 0} emptyMessage={t('invites.empty_message')}>
                    {invites.map((row) => (
                        <TableRow key={row.invite}>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.username')}</div>
                                <div className='text-secondary'>{row.invite}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.email')}</div>
                                <div className='text-secondary'>
                                    <div
                                        className='badge rounded-pill px-3 py-2 fw-medium'
                                        style={{
                                            backgroundColor: `${COLORS[row.role]}${OPACITY}`,
                                        }}
                                    >
                                        <span className='text-sm font-weight-bold' style={{ color: COLORS[row.role] }}>
                                            {t(`users.${row.role.toLowerCase()}`).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-3'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.email')}</div>
                                <div className='text-secondary'>{new Date(row.createdAt).toLocaleString()}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-3'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>{t('users.email')}</div>
                                <div className='text-secondary'>{new Date(row.expiresAt).toLocaleString()}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    <button onClick={() => remove(row)} className='btn btn-dark rounded-2'>
                                        <Trash size={16} />
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

const GenerateInvite = () => {
    const { t } = useI18n();
    const { create } = useInvites();
    const { showSnackbar } = useSnackbar();
    const [, setSearchParams] = useSearchParams();

    const handleGenerate = async (role: UserRole) => {
        const invite = await create({ role: role })
        if (!invite.ok) {
            showSnackbar(invite.error, 'error');
            return;
        }
        setSearchParams((previous) => {
            const params = new URLSearchParams(previous)
            params.set('refresh', Date.now().toString())
            return params
        })
    }

    return (
        <div className='row g-4 mb-5'>
            <div className='col-12 col-lg-4'>
                <RoleCard
                    role='CONTRIBUTOR'
                    title={t('users.contributor')}
                    description={t('invites.contributor_description')}
                    icon={<UserPen className='text-blue' />}
                    onGenerate={() => handleGenerate('CONTRIBUTOR')}
                />
            </div>
            <div className='col-12 col-lg-4'>
                <RoleCard
                    role='EDITOR'
                    title={t('users.editor')}
                    description={t('invites.editor_description')}
                    icon={<UserRoundCheck className='text-green' />}
                    onGenerate={() => handleGenerate('EDITOR')}
                />
            </div>
            <div className='col-12 col-lg-4'>
                <RoleCard
                    role='ADMIN'
                    title={t('users.admin')}
                    description={t('invites.admin_description')}
                    icon={<ShieldUser className='text-purple' />}
                    onGenerate={() => handleGenerate('ADMIN')}
                />
            </div>
        </div >
    )
}

export function Invites() {
    const { t } = useI18n();
    const { remove } = useInvites();
    const [open, setOpen] = useState<null | Invite>(null);
    const navigate = useNavigate();

    const expiredFalse = useMemo(() => ({ expired: false }), []);
    const expiredTrue = useMemo(() => ({ expired: true }), []);

    const config: ModalConfig = {
        title: t('invites.delete_title'),
        subtitle: t('invites.delete_confirmation'),
        alert: t('invites.delete_alert'),
        confirmLabel: t('common.delete'),
        action: remove,
        getRedirect: () => `/backoffice/invites?tab=archived&refresh=${Date.now()}`,
        variant: 'danger',
    }

    const { showSnackbar } = useSnackbar();

    const handleConfirm = async () => {
        if (!open || !config) return;
        const res = await config.action(open.id);
        if (!res.ok) {
            showSnackbar(res.error, 'error');
            return;
        }
        setOpen(null);
        navigate(config.getRedirect());
    };

    return (
        <>
            <GenerateInvite />
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder={t('categories.search_placeholder')} />
                    </>
                }
            >
                <Tab id='active' label={t('common.active-m')}>
                    <InvitesTable filter={expiredFalse} remove={(invite) => { setOpen(invite); }} />
                </Tab>
                <Tab id='expired' label={t('common.expired')}>
                    <InvitesTable filter={expiredTrue} remove={(invite) => { remove(invite.id); }} />
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
