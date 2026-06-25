export type Credit = { name: string; role: string; slug?: string | null };

export type CreditGroup = {
    role: string;
    label: string;
    people: { name: string; slug?: string | null }[];
};

export const groupCredits = (credits: Credit[] | undefined, creditLabel: (role: string) => string,): CreditGroup[] => {
    if (!credits?.length) return [];
    const byRole = new Map<string, { name: string; slug?: string | null }[]>();
    for (const c of credits) {
        const people = byRole.get(c.role) ?? [];
        people.push({ name: c.name, slug: c.slug });
        byRole.set(c.role, people);
    }
    return Array.from(byRole, ([role, people]) => ({ role, label: creditLabel(role), people }));
};
