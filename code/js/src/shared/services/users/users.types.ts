import type { Pagination } from '@/shared/types/Pagination';
import type { Query } from '@/shared/types/Query';

export type User = {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
    profilePictureURL: string;
    role: UserRole;
}

export type UserRole = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';

export type UsersResponse = {
    items: User[];
    pagination: Pagination;
};

export interface UsersService {
    fetchAll(params: Query): Promise<UsersResponse>;
}
