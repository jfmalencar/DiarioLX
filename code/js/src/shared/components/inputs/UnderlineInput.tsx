export const UnderlineInput = ({
    value,
    name,
    placeholder,
    disabled,
    onChange,
    dataTestId
}: {
    value: string;
    name: string;
    placeholder: string;
    disabled?: boolean;
    dataTestId?: string;
    onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
}) => {
    return (
        <input
            data-testid={dataTestId}
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
