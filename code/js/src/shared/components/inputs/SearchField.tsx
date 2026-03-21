import { useEffect, useState, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

type Option = {
    id: string;
    name: string;
};

export const SearchField = ({
    value,
    options,
    disabled,
    placeholder,
    onSearch,
    onSelect,
}: {
    value: string;
    disabled?: boolean;
    options: Option[];
    placeholder: string;
    onSearch: (ev: React.FormEvent<HTMLInputElement>) => void;
    onSelect: (option: Option) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (ev: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(ev.target as Node)) {
                setIsOpen(false);
            }
        }

        const handleEscape = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape') setIsOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className='position-relative' ref={containerRef}>
            <div className='position-relative'>
                <Search size={18} className='position-absolute top-50 translate-middle-y text-muted' style={{ left: 0 }} />
                <input
                    value={value}
                    name='parentSearch'
                    disabled={disabled}
                    onChange={onSearch}
                    onFocus={() => setIsOpen(true)}
                    className='form-control border-0 border-bottom rounded-0 bg-transparent shadow-none ps-4 pe-4'
                    placeholder={placeholder}
                    style={{ borderColor: '#cfcfcf', fontSize: '1.15rem' }}
                />
                <ChevronDown
                    size={18}
                    className='position-absolute top-50 translate-middle-y text-muted'
                    style={{ right: 0, cursor: 'pointer' }}
                    onClick={() => setIsOpen((current) => !current)}
                />
            </div>
            {isOpen && options.length > 0 && (
                <div
                    className='position-absolute start-0 end-0 bg-white border rounded-3 mt-2 shadow-sm overflow-auto'
                    style={{ zIndex: 30, maxHeight: 220 }}
                >
                    {options.map((option) => (
                        <button
                            key={option.id}
                            disabled={disabled}
                            type='button'
                            className='btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-3 border-0 rounded-0'
                            onClick={() => {
                                onSelect(option);
                                setIsOpen(false);
                            }}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
