import type { Query } from '@/shared/types/Query';
import type { UserRole } from '../users/users.types';
import type { Pagination } from '@/shared/types/Pagination';

export type Invite = {
  invite: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export type InviteFormValues = {
  role: UserRole;
}

export type InviteRequest = {
  role: UserRole;
}

export type InvitesResponse = {
  invites: Invite[];
  pagination: Pagination
};

export type InviteResponse = {
  invite: Invite;
}

export interface InvitesService {
  fetchAll(params: Query): Promise<InvitesResponse>;

  create(invite: InviteFormValues): Promise<string | undefined>;

  delete(id: string): Promise<void>;
}
