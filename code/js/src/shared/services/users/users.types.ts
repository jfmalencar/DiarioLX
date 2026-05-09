import type { Query } from '@/shared/types/Query';

export type User = {
    userId: string;
    username: string;
    email: string;
    fName: string;
    lName: string;
    bio: string;
    profilePictureURL: string;
    role: UserRole;
}

export type UserRole = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';

export type UsersResponse = {
    users: User[];
};

export interface UsersService {
    fetchAll(params: Query): Promise<UsersResponse>;
}
