import type { Pagination } from '@/shared/types/Pagination';
import type { Query } from '@/shared/types/Query';
import type { Endpoints } from '../bootstrap/bootstrap.types';

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
    bio: string | null;
    profilePicturePath: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    role: UserRole;
    features: string[]
};

export interface UsersService {
    fetchAll(params: Query): Promise<UsersResponse>;

    getCurrentUser(apiOverride?: Endpoints): Promise<UserApiResponse | undefined>;

    updateProfile(
        username?: string,
        email?: string,
        password?: string,
        firstName?: string,
        lastName?: string,
        bio?: string | null
    ): Promise<boolean | undefined>;

    completeAvatarUpload: (id: number) => Promise<void>;

    deactivate: (id: number) => Promise<void>;

    remove: (id: number) => Promise<void>;
}
