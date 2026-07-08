const MONTHS = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
];

export const formatDate = (date: Date, showYear: boolean = false) => {
    if (Number.isNaN(date.getTime())) return 'N/D';
    const value = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
    if (showYear || date.getFullYear() !== new Date().getFullYear()) {
        return `${value} ${date.getFullYear()}`;
    }
    return value;
};

export const slugify = (value: string) => {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
