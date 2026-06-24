import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router';
import { ExternalLink, Edit, ClipboardCheck, FileText, Video, Mic, Radio } from 'lucide-react';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { TableBody, Table, TableHeader, TableColumn, TableRow, TablePagination } from '@/shared/components/table/Table';
import { TableSearch } from '@/shared/components/table/TableSearch';
import { TableFilters } from '@/shared/components/table/TableFilters';
import { useContents, type ContentState } from '@/shared/hooks/useContents';
import { useI18n } from '@/shared/hooks/useI18n';
import { useFilters, type FilterSection } from '@/shared/hooks/useFilters';
import { usePath } from '@/shared/hooks/usePath';
import { useAuthentication } from '@/shared/hooks/useAuthentication';

const typeIcon = {
    ARTICLE: <FileText size={14} className='text-muted' />,
    VIDEO: <Video size={14} className='text-muted' />,
    EPISODE: <Mic size={14} className='text-muted' />,
    PODCAST: <Radio size={14} className='text-muted' />,
};

const sections: FilterSection[] = [
    {
        key: 'type',
        title: 'TIPO',
        options: [
            { value: 'VIDEO', label: 'Vídeo' },
            { value: 'ARTICLE', label: 'Artigo' },
            { value: 'EPISODE', label: 'Episódio' },
            { value: 'PODCAST', label: 'Podcast' },
        ],
    }
];

type Props = {
    filter: {
        state: ContentState
    };
};

const ContentsTable = ({ filter }: Props) => {
    const { t } = useI18n();
    const { loading, contents, pagination, fetchAll } = useContents();
    const { buildQuery } = useFilters();
    const [searchParams] = useSearchParams();
    const { buildMediaUrl } = usePath();
    const { user } = useAuthentication();

    const canEditPublished = user?.features?.includes('edit-published')

    useEffect(() => {
        const params = buildQuery({ p: 'page', total: 'size', search: 'query', type: 'type' }, { state: filter.state });
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
                    {contents.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableColumn className='col-lg-5'>
                                <div className='d-flex align-items-center gap-3'>
                                    <div
                                        className='d-flex align-items-center justify-content-center border border-dark flex-shrink-0'
                                        style={{ width: 135, height: 80, overflow: 'hidden', backgroundColor: '#f0f0f0' }}
                                    >
                                        {row.featuredImage ? (
                                            row.type === 'VIDEO' ? (
                                                <video
                                                    src={`${buildMediaUrl(row.featuredImage)}#t=1`}
                                                    muted
                                                    preload='metadata'
                                                    className='w-100'
                                                    style={{ height: 180, objectFit: 'cover', display: 'block' }}
                                                />
                                            ) : (
                                                <img
                                                    src={buildMediaUrl(row.featuredImage)}
                                                    alt={row.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            )
                                        ) : (
                                            <div className='d-flex align-items-center justify-content-center w-100 h-100 text-muted'>
                                                {typeIcon[row.type]}
                                            </div>
                                        )}
                                    </div>
                                    <div className='d-flex align-items-center gap-2'>
                                        {typeIcon[row.type]}
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
                                <div className='text-secondary'>{row.authors.map(author => author.name).join(', ')}</div>
                            </TableColumn>
                            <TableColumn className='col-6 col-lg-2 text-lg-end'>
                                <div className='d-flex d-lg-flex justify-content-center gap-2'>
                                    {row.state === 'PUBLISHED' &&
                                        <Link to={`/p/${row.slug}`} target='_blank' className='btn btn-outline-dark rounded-2'>
                                            <ExternalLink size={16} />
                                        </Link>
                                    }
                                    {(row.state !== 'PUBLISHED' || canEditPublished) &&
                                        <Link
                                            to={`/backoffice/contents/${row.id}`}
                                            className='btn btn-dark rounded-2'
                                            data-testid={`manage-content-button-${index}`}
                                        >
                                            <Edit size={16} />
                                        </Link>
                                    }
                                    {row.state === 'PENDING_REVIEW' &&
                                        <Link
                                            to={`/backoffice/contents/${row.id}/review`}
                                            className='btn btn-outline-dark rounded-2'
                                        >
                                            <ClipboardCheck size={16} />
                                        </Link>
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

export const Contents = () => {
    const { t } = useI18n();

    return (
        <>
            <Tabs
                toolbar={
                    <>
                        <TableSearch placeholder='Pesquisar publicação' />
                        <TableFilters sections={sections} />
                    </>
                }
            >
                <Tab id='published' label={t('common.published')}>
                    <ContentsTable filter={{ state: 'PUBLISHED' }} />
                </Tab>
                <Tab id='pending' label={t('common.pending')}>
                    <ContentsTable filter={{ state: 'PENDING_REVIEW' }} />
                </Tab>
                <Tab id='draft' label={t('common.draft')}>
                    <ContentsTable filter={{ state: 'DRAFT' }} />
                </Tab>
                <Tab id='rejected' label={t('common.rejected')}>
                    <ContentsTable filter={{ state: 'REJECTED' }} />
                </Tab>
            </Tabs>
        </>
    );
}
