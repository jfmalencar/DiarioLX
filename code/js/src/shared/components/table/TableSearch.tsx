import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

type Props = {
    placeholder?: string;
    expandedWidth?: number;
};

export function TableSearch({
    placeholder,
    expandedWidth = 280,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const appliedValue = searchParams.get('search') || '';
    const [localValue, setLocalValue] = useState(appliedValue);
    const [isOpen, setIsOpen] = useState(appliedValue.length > 0);
    const isExpanded = isOpen || localValue.trim().length > 0;

    useEffect(() => {
        setLocalValue(appliedValue);
    }, [appliedValue]);

    const handleOpen = () => {
        setIsOpen(true);
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    }

    const handleBlur = () => {
        if (localValue.trim().length === 0) {
            setIsOpen(false);
        }
    }

    const applySearch = (value: string) => {
        const nextParams = new URLSearchParams(searchParams);

        if (value.trim().length > 0) {
            nextParams.set('search', value);
        } else {
            nextParams.delete('search');
        }

        nextParams.delete('page');
        setSearchParams(nextParams, { replace: true });
    }

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            applySearch(localValue);
        }
    }

    return (
        <div
            className='position-relative d-flex align-items-center'
            style={{
                width: isExpanded ? expandedWidth : 40,
                transition: 'width 220ms ease',
                overflow: 'hidden',
            }}
        >
            <button
                type='button'
                onClick={handleOpen}
                data-testid='table-search-button'
                className='btn p-0 border-0 bg-transparent position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center'
                style={{
                    left: 0,
                    width: 40,
                    height: 40,
                    zIndex: 2,
                }}
            >
                <Search size={16} />
            </button>
            <input
                ref={inputRef}
                value={localValue}
                data-testid='table-search-input'
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder}
                className='form-control border-0 rounded-0 bg-transparent ps-5 pe-0'
                style={{
                    opacity: isExpanded ? 1 : 0,
                    transition: 'opacity 160ms ease',
                    pointerEvents: isExpanded ? 'auto' : 'none',
                }}
            />
        </div>
    );
}