import type { Query } from '@/shared/types/Query';

export type User = {
    userId: string;
    username: string;
    email: string;
    fName: string;
    lName: string;
    bio: string;
    profilePictureURL: string;
}

export type UsersResponse = {
    users: User[];
};

export interface UsersService {
    fetchAll(params: Query): Promise<UsersResponse>;
}
