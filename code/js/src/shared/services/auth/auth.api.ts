import { useMemo } from 'react';

import type { AuthService, LoginResponseDTO } from './auth.types';
import { post } from '../http/client';
import { useBootstrap } from '@/shared/hooks/useBootstrap';

export const useAuthApiService = (): AuthService => {
  const { endpoints } = useBootstrap()

  return useMemo<AuthService>(() => ({
    async authenticate(username, password) {
      const result = await post<LoginResponseDTO>(endpoints.auth.login.href, {
        username,
        password,
      });

      if (!result.success) {
        return undefined;
      }

      return result.data;
    },

    async logout() {
      await post(endpoints.auth.logout.href, {});
    },

    async register(username, email, password, firstName, lastName, inviteCode) {
      const result = await post<undefined>(
        endpoints.auth.register.href,
        {
          username,
          email,
          password,
          firstName: firstName,
          lastName: lastName,
        },
        {
          headers: {
            Authorization: `Invite ${inviteCode}`,
          },
        }
      );
      if (!result.success) {
        return false
      }
      return true;
    },
  }), [endpoints]);
}
