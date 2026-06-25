export type TeamMember = {
    id: number;
    name: string;
    slug: string;
    position: string;
    bio: string;
    photoPath: string | null;
};

export interface TeamService {
    fetchTeam(): Promise<TeamMember[]>;

    // Public profile of any user by username — works for any author or
    // credited person, not only team members.
    fetchByUsername(slug: string): Promise<TeamMember>;
}
