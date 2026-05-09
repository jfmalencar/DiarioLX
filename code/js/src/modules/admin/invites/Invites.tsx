import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { UserPen, ShieldUser, Trash, UserRoundCheck } from 'lucide-react';

import type { UserRole } from '@/shared/services/users/users.types';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { useInvites } from '@/shared/hooks/useInvites';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';

import { Button } from '@/shared/components/Button';

type Props = {
    filter: { expired: boolean };
};

const OPACITY = 25
const COLORS = {
    CONTRIBUTOR: '#006eff',
    EDITOR: '#179b00',
    ADMIN: '#6a00ff',
}

const InvitesTable = ({ filter }: Props) => {
    const { t } = useI18n();
    const { invites, fetchAll } = useInvites();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'limit' }, { expired: filter.expired });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <Table dataTestId='invites-table' isEmpty={invites.length === 0} emptyMessage='Nenhum convite encontrado.'>
            <TableHeader>
                <TableColumn className='col-lg-2' isHeader={true}>
                    Código
                </TableColumn>
                <TableColumn className='col-lg-2' isHeader={true}>
                    Função
                </TableColumn>
                <TableColumn className='col-lg-3' isHeader={true}>
                    Criado em
                </TableColumn>
                <TableColumn className='col-lg-3' isHeader={true}>
                    Expira em
                </TableColumn>
                <TableColumn className='col-lg-2 text-center' isHeader={true}>
                    {t('common.actions')}
                </TableColumn>
            </TableHeader>
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
                            <button onClick={() => alert('TO-DO')} className='btn btn-dark rounded-2'>
                                <Trash size={16} />
                            </button>
                        </div>
                    </TableColumn>
                </TableRow>
            ))}
        </Table>
    );
}

const GenerateInvite = () => {
    const { create } = useInvites();
    const [, setSearchParams] = useSearchParams();

    const handleGenerate = async (role: UserRole) => {
        const invite = await create({ role: role })
        if (invite) {
            setSearchParams((previous) => {
                const params = new URLSearchParams(previous)
                params.set('refresh', Date.now().toString())
                return params
            })
        }
    }

    return (
        <div className='row g-4 mb-5'>
            <div className='col-12 col-lg-4'>
                <div className='card border-0 shadow-sm h-100 rounded-4'>
                    <div className='card-body d-flex flex-column'>
                        <div className='d-flex align-items-center mb-4'>
                            <div
                                className='d-flex align-items-center justify-content-center rounded-4 me-3'
                                style={{
                                    width: 56,
                                    height: 56,
                                    backgroundColor: `${COLORS.CONTRIBUTOR}${OPACITY}`,
                                }}
                            >
                                <UserPen className='text-blue' />
                            </div>
                            <div>
                                <h5 className='fw-semibold mb-1'>Colaborador</h5>
                                <small className='text-muted'>
                                    Pode criar e gerir as próprias publicações.
                                </small>
                            </div>
                        </div>
                        <div className='mt-auto'>
                            <Button onClick={() => handleGenerate('CONTRIBUTOR')}>Gerar Convite</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-12 col-lg-4'>
                <div className='card border-0 shadow-sm h-100 rounded-4'>
                    <div className='card-body d-flex flex-column'>
                        <div className='d-flex align-items-center mb-4'>
                            <div
                                className='d-flex align-items-center justify-content-center rounded-4 me-3'
                                style={{
                                    width: 56,
                                    height: 56,
                                    backgroundColor: `${COLORS.EDITOR}${OPACITY}`,
                                }}
                            >
                                <UserRoundCheck className='text-green' />
                            </div>

                            <div>
                                <h5 className='fw-semibold mb-1'>Editor</h5>
                                <small className='text-muted'>
                                    Pode editar, publicar e gerir conteúdos.
                                </small>
                            </div>
                        </div>
                        <div className='mt-auto'>
                            <Button onClick={() => handleGenerate('EDITOR')}>Gerar Convite</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-12 col-lg-4'>
                <div className='card border-0 shadow-sm h-100 rounded-4'>
                    <div className='card-body d-flex flex-column'>
                        <div className='d-flex align-items-center mb-4'>
                            <div
                                className='d-flex align-items-center justify-content-center rounded-4 me-3'
                                style={{
                                    width: 56,
                                    height: 56,
                                    backgroundColor: `${COLORS.ADMIN}${OPACITY}`,
                                }}
                            >
                                <ShieldUser className='text-purple' />
                            </div>
                            <div>
                                <h5 className='fw-semibold mb-1'>Administrador</h5>
                                <small className='text-muted'>
                                    Acesso total à plataforma e gestão de utilizadores.
                                </small>
                            </div>
                        </div>
                        <div className='mt-auto'>
                            <Button onClick={() => handleGenerate('ADMIN')}>Gerar Convite</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Invites() {
    const { t } = useI18n();

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
                <Tab id='active' label={t('common.active')}>
                    <InvitesTable filter={{ expired: false }} />
                    <TablePagination />
                </Tab>
                <Tab id='expired' label={t('common.expired')}>
                    <InvitesTable filter={{ expired: true }} />
                    <TablePagination />
                </Tab>
            </Tabs>
        </>
    );
}
