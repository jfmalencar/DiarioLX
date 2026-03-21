import { useState } from 'react';
import { Plus } from 'lucide-react';

export type ActionOption = {
    key: string;
    label: string;
    action: () => void;
};

type Props = {
    options: ActionOption[];
};

export function FloatingActionMenu({ options }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    }

    const handleSelect = (option: ActionOption) => {
        option.action();
        setIsOpen(false);
    }

    return (
        <div
            className='position-fixed d-flex flex-column align-items-end'
            style={{ bottom: 32, right: 32, zIndex: 1050 }}
        >
            <div
                className='bg-transparent p-2 mb-2'
                style={{
                    width: 240,
                    borderRadius: 8,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 200ms ease, transform 200ms ease',
                }}
            >
                <div className='d-flex flex-column gap-2'>
                    {options.map((option) => (
                        <button
                            key={option.key}
                            type='button'
                            className='btn btn-dark text-start rounded-2'
                            style={{ boxShadow: '0 .125rem .25rem rgba(0,0,0,.2)' }}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
            <button
                type='button'
                onClick={handleToggle}
                className='btn d-flex align-items-center justify-content-center rounded-3'
                style={{
                    width: 64,
                    height: 64,
                    backgroundColor: isOpen ? '#fff' : '#000',
                    color: isOpen ? '#000' : '#fff',
                    border: isOpen ? '2px solid #000' : 'none',
                    transition: 'all 200ms ease',
                }}
            >
                <span
                    style={{
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease',
                    }}
                >
                    <Plus />
                </span>
            </button>
        </div>
    );
}
