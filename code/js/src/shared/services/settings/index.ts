import { getEnv } from '@/config/env';

import type { SettingsService } from './settings.types';
import { useSettingsApiService } from './settings.api';
import { useSettingsMockService } from './settings.mock';

const useFake = getEnv('VITE_MOCK_API') === 'true';

export const useSettingsService: () => SettingsService = useFake
    ? useSettingsMockService
    : useSettingsApiService;
