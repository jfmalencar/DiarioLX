import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router';
import { ExternalLink } from 'lucide-react';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { TableBody, Table, TableHeader, TableColumn, TableRow, TablePagination } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { useContents } from '@/shared/hooks/useContents';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters } from '@/shared/hooks/useFilters';
import { usePath } from '@/shared/hooks/usePath';

type Props = {
    filter: { archived: boolean };
};

const ContentsTable = ({ filter }: Props) => {
    const { t } = useI18n();
    const { loading, contents, pagination, fetchAll } = useContents();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();
    const { buildMediaUrl } = usePath();

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query' }, { archived: filter.archived });
        fetchAll(params)
    }, [fetchAll, searchParams, filter, buildQuery]);

    return (
        <>
            <Table dataTestId='contents-table' >
                <TableHeader>
                    <TableColumn className='col-lg-5' isHeader={true}>
                        PUBLICAÇÃO
                    </TableColumn>
                    <TableColumn className='col-lg-2' isHeader={true}>
                        CRIAÇÃO
                    </TableColumn>
                    <TableColumn className='col-lg-3' isHeader={true}>
                        AUTORES
                    </TableColumn>
                    <TableColumn className='col-lg-2 text-center' isHeader={true}>
                        {t('common.actions')}
                    </TableColumn>
                </TableHeader>
                <TableBody cols={4} loading={loading} isEmpty={contents.length === 0} emptyMessage='Nenhuma publicação encontrada.'>
                    {contents.map((row) => (
                        <TableRow key={row.id}>
                            <TableColumn className='col-lg-5'>
                                <div className='d-flex align-items-center gap-3'>
                                    <div
                                        className='d-flex align-items-center justify-content-center border border-dark flex-shrink-0'
                                        style={{ width: 135, height: 80, overflow: 'hidden' }}
                                    >
                                        {row.type === 'VIDEO' ?
                                            <video
                                                src={`${buildMediaUrl(row.featuredImage)}#t=1`}
                                                poster={undefined}
                                                muted
                                                preload='metadata'
                                                className='w-100'
                                                style={{
                                                    height: 180,
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                }}
                                            />
                                            :
                                            <img src={buildMediaUrl(row.featuredImage)}
                                                alt={row.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        }
                                    </div>
                                    <div>
                                        <div className='fw-medium text-dark' style={{ fontSize: '1.1rem' }}>
                                            {row.title}
                                        </div>
                                    </div>
                                </div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>CRIAÇÃO</div>
                                <div className='text-secondary'>{new Date(row.createdAt).toLocaleDateString()}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-3'>
                                <div className='text-muted d-lg-none small text-uppercase mb-1'>AUTORES</div>
                                <div className='text-secondary'>{row.authors.join(', ')}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    <Link to={`/p/${row.slug}`} target='_blank' className='btn btn-outline-dark rounded-2'>
                                        <ExternalLink size={16} />
                                    </Link>
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

export const Contents = () => {
    const { t } = useI18n();

    return (
        <>
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder='Pesquisar publicação' />
                    </>
                }
            >
                <Tab id='active' label={t('common.active-f')}>
                    <ContentsTable filter={{ archived: false }} />
                </Tab>
            </Tabs>
        </>
    );
}
