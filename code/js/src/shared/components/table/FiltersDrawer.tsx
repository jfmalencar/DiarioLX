import { useEffect } from 'react';
import { X } from 'lucide-react'

import { useI18n } from '@/shared/hooks/useI18n';
import { Button } from '@/shared/components/Button';

export type FiltersValue = Record<string, string[]>;

export type FilterSection = {
    key: string;
    title: string;
    options: { value: string; label: string }[];
};

type Props = {
    isOpen: boolean;
    value: FiltersValue;
    onChange: (value: FiltersValue) => void;
    onClose: () => void;
    onClear: () => void;
    onApply: () => void;
    sections: FilterSection[]
};

export function FiltersDrawer({
    isOpen,
    value,
    onChange,
    onClose,
    onClear,
    onApply,
    sections
}: Props) {
    const { t } = useI18n();

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(ev: KeyboardEvent) {
            if (ev.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const toggleValue = (sectionKey: keyof FiltersValue, optionValue: string) => {
        const currentValues = value[sectionKey];
        const exists = currentValues.includes(optionValue);

        onChange({
            ...value,
            [sectionKey]: exists
                ? currentValues.filter((item) => item !== optionValue)
                : [...currentValues, optionValue],
        });
    }

    return (
        <>
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 ${isOpen ? 'd-block' : 'd-none'}`}
                style={{ backgroundColor: 'rgba(0,0,0,0.08)', zIndex: 1040 }}
                onClick={onClose}
            />
            <aside
                className='position-fixed top-0 end-0 h-100 bg-white border-start'
                style={{
                    width: 380,
                    maxWidth: '100%',
                    zIndex: 1050,
                    transition: 'transform 280ms ease',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div className='d-flex justify-content-end p-4'>
                    <button
                        type='button'
                        className='btn p-0 border-0 bg-transparent fs-2 lh-1'
                        onClick={onClose}
                        aria-label={t('filters.close')}
                    >
                        <X />
                    </button>
                </div>
                <div className='flex-grow-1 overflow-auto px-4 pb-4'>
                    {sections.map((section) => (
                        <div key={section.key} className='mb-5'>
                            <div className='fw-bold mb-3'>{section.title}</div>
                            <div className='d-flex flex-wrap gap-2'>
                                {section.options.map((option) => {
                                    const selected = value[section.key].includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            type='button'
                                            className={`btn btn-sm rounded-2 ${selected ? 'btn-dark' : 'btn-outline-dark'}`}
                                            onClick={() => toggleValue(section.key, option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='border-top p-4 d-flex justify-content-end gap-3'>
                    <Button type='button' color='secondary' onClick={onClear} className='px-4'>
                        {t('filters.clear')}
                    </Button>
                    <Button dataTestId='apply-filters-button' type='button' onClick={onApply} className='px-4'>
                        {t('filters.apply')}
                    </Button>
                </div>
            </aside>
        </>
    );
}
