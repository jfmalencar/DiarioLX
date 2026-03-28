import React from 'react';
import { useSearchParams } from 'react-router-dom';

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

export function Table({ children, isEmpty, emptyMessage = 'Sem dados', dataTestId }: TableProps) {
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

export function TableHeader({ children }: TableHeaderProps) {
    return (
        <div
            className='row d-none d-lg-flex text-uppercase text-muted small border-bottom pb-2 mb-0 position-sticky top-0 bg-light'
            style={{ letterSpacing: '0.05em' }}
        >
            {children}
        </div>
    );
}

export function TableRow({ children }: TableRowProps) {
    return <div className='row align-items-center border-bottom py-4 g-3'>{children}</div>;
}

export function TableColumn({ children, className, isHeader }: TableColumnProps) {
    return <div className={className || (isHeader ? 'col' : 'col-12')}>{children}</div>;
}

export function TablePagination() {
    /*
    Componente pra testar paginação, mas versão final deve ser
    mais complexa, com indicação de página atual, total de páginas,
    etc. Deve também ser possível receber total de páginas e ir
    para uma página específica.
    */
    const [searchParams, setSearchParams] = useSearchParams();

    const goToNext = () => {
        const page = parseInt(searchParams.get('p') || '1', 10);
        goToPage(page + 1);
    }

    const goToPrevious = () => {
        const page = parseInt(searchParams.get('p') || '1', 10);
        goToPage(page - 1);
    }

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('p', page.toString());
        setSearchParams(params);
    }

    return (
        <div className='d-flex align-items-center gap-3 mt-4'>
            <div className='btn-group' role='group'>
                <button type='button' onClick={() => goToPrevious()} className='btn btn-outline-secondary btn-sm' >
                    Anterior
                </button>
                <button type='button' onClick={() => goToNext()} className='btn btn-outline-secondary btn-sm' >
                    Seguinte
                </button>
            </div>
        </div>
    );
}