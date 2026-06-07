import type { Pagination } from '@/shared/types/Pagination';
import type { Query } from '@/shared/types/Query';

export type UserRole = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';

export type UsersResponse = {
    items: User[];
    pagination: Pagination;
};

export type UserApiResponse = User

export type User = {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string | null;
    profilePicturePath: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    role: UserRole;
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
        bio?: string | null
    ): Promise<boolean | undefined>;

    completeAvatarUpload: (id: string) => Promise<void>;
}
