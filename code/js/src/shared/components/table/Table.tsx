import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../Button'

type TableProps = {
    children: React.ReactNode;
    dataTestId?: string;
};

type TableHeaderProps = {
    children: React.ReactNode;
};

type TableRowProps = {
    children: React.ReactNode;
    className?: string;
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

type TableBodyProps = {
    children: React.ReactNode;
    loading?: boolean;
    emptyMessage?: string;
    isEmpty?: boolean;
    cols: number;
}

export const Table = ({ children, dataTestId }: TableProps) => {
    return <table data-testid={dataTestId} className='w-100'>{children}</table>;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
    return (
        <thead>
            {children}
        </thead>
    );
}

export const TableBody = ({ children, cols, loading, isEmpty, emptyMessage }: TableBodyProps) => {
    if (loading) {
        return (
            <tbody>{
                [...Array(5)].map((_, row) => (
                    <TableRow key={row}>
                        {Array.from({ length: cols }, (_, col) => (
                            <TableColumn key={col} className='placeholder-glow'>
                                <span className='placeholder w-75 rounded' />
                            </TableColumn>
                        ))}
                    </TableRow>
                ))
            }
            </tbody>
        )
    }
    if (isEmpty) {
        return (
            <tbody>
                <tr>
                    <td colSpan={cols} className='text-center py-5'>
                        <p className='text-muted mb-0'>{emptyMessage}</p>
                    </td>
                </tr>
            </tbody>
        );
    }
    return (
        <tbody>
            {children}
        </tbody>
    );
}

export const TableRow = ({ children, className }: TableRowProps) => {
    return <tr className={`border-bottom ${className || ''}`}>{children}</tr>;
}

export const TableColumn = ({ children, className, isHeader }: TableColumnProps) => {
    return <td className={`${(isHeader ? 'text-muted border-bottom pb-3 text-uppercase' : 'py-4')} ${className || (isHeader ? 'col' : 'col-12')}`}>{children}</td>;
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
