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

    fetchByUsername(slug: string): Promise<TeamMember>;
}
