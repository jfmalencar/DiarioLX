import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { AuthService } from './auth.types';
import { useApi } from '../http/client';

export const useAuthApiService = (): AuthService => {
  const { endpoints } = useBootstrap()
  const { post } = useApi()

  return useMemo<AuthService>(() => ({
    async authenticate(username, password) {
      const result = await post<void>(endpoints.auth.login.href, {
        username,
        password,
      });

      if (!result.success) {
        return undefined;
      }

      return true;
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
          inviteCode: inviteCode,
        },
      );
      if (!result.success) {
        return false
      }
      return true;
    },
  }), [endpoints, post]);
}
