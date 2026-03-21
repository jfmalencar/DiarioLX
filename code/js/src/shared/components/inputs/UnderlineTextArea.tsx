export const UnderlineTextArea = ({
    value,
    name,
    onChange,
    disabled,
    placeholder,
}: {
    value: string;
    name: string;
    disabled?: boolean;
    onChange: (ev: React.FormEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}) => {
    return (
        <textarea
            value={value}
            name={name}
            disabled={disabled}
            onChange={onChange}
            className='form-control border-0 border-bottom rounded-0 px-0 bg-transparent shadow-none'
            placeholder={placeholder}
            rows={6}
            style={{ borderColor: '#cfcfcf', fontSize: '1.05rem', resize: 'vertical' }}
        />
    );
}
