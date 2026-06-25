import type { Pagination } from '@/shared/types/Pagination';
import type { Query } from '@/shared/types/Query';

export type UserRole = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';

export type UsersResponse = {
    items: User[];
    pagination: Pagination;
};

export type UserApiResponse = User

export type User = {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    position: string | null;
    bio: string | null;
    onTeam: boolean;
    profilePicturePath: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    role: UserRole;
    features: string[]
};

export interface UsersService {
    fetchAll(params: Query): Promise<UsersResponse>;

    getCurrentUser(): Promise<UserApiResponse | undefined>;

    updateProfile(
        username?: string,
        email?: string,
        password?: string,
        firstName?: string,
        lastName?: string,
        bio?: string | null,
        position?: string | null,
        onTeam?: boolean
    ): Promise<boolean | undefined>;

    setOnTeam: (id: number, onTeam: boolean) => Promise<void>;

    completeAvatarUpload: (id: number) => Promise<void>;

    deactivate: (id: number) => Promise<void>;

    remove: (id: number) => Promise<void>;
}
