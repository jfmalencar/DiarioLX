export const UnderlineInput = ({
    value,
    name,
    placeholder,
    disabled,
    onChange,
}: {
    value: string;
    name: string;
    placeholder: string;
    disabled?: boolean;
    onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
}) => {
    return (
        <input
            value={value}
            name={name}
            disabled={disabled}
            onChange={onChange}
            className='form-control border-0 border-bottom rounded-0 px-0 bg-transparent shadow-none'
            placeholder={placeholder}
            style={{ borderColor: '#cfcfcf', fontSize: '1.15rem' }}
        />
    );
}
