import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../Button'

type TableProps = {
    children: React.ReactNode;
    emptyMessage?: string;
    isEmpty?: boolean;
    dataTestId?: string;
};

type TableHeaderProps = {
    children: React.ReactNode;
};

type TableRowProps = {
    children: React.ReactNode;
};

type TableColumnProps = {
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    isHeader?: boolean;
};

type TablePaginationProps = {
    hasPrevious: boolean;
    hasNext: boolean;
};

export const Table = ({ children, isEmpty, emptyMessage = 'Sem dados', dataTestId }: TableProps) => {
    if (isEmpty) {
        return (
            <div className='row' data-testid={dataTestId}>
                <div className='col-12 text-center py-5'>
                    <p className='text-muted mb-0'>{emptyMessage}</p>
                </div>
            </div>
        );
    }
    return <div data-testid={dataTestId}>{children}</div>;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
    return (
        <div
            className='row d-none d-lg-flex text-uppercase text-muted small border-bottom pb-2 mb-0 position-sticky top-0 bg-light'
            style={{ letterSpacing: '0.05em' }}
        >
            {children}
        </div>
    );
}

export const TableRow = ({ children }: TableRowProps) => {
    return <div className='row align-items-center border-bottom py-4 g-3'>{children}</div>;
}

export const TableColumn = ({ children, className, isHeader }: TableColumnProps) => {
    return <div className={className || (isHeader ? 'col' : 'col-12')}>{children}</div>;
}

export const TablePagination = ({ hasPrevious, hasNext }: TablePaginationProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get('p') || '1', 10);

    const goToPage = (page: number) => {
        searchParams.set('p', page.toString());
        setSearchParams(searchParams);
    };

    return (
        <div className='d-flex w-100 mt-4 align-items-center justify-content-between'>
            <Button onClick={() => goToPage(currentPage - 1)} color='secondary' disabled={!hasPrevious}>
                <ChevronLeft size={16} />
            </Button>
            <Button onClick={() => goToPage(currentPage + 1)} color='secondary' disabled={!hasNext}>
                <ChevronRight size={16} />
            </Button>
        </div>
    );
}
