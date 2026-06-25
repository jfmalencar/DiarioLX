import { useMemo } from 'react';

import type { SettingsService, BackofficeSettings } from './settings.types';

let fakeSettings: BackofficeSettings = {
    social: { facebook: 'https://facebook.com/diariolx', twitter: 'https://twitter.com/diariolx', instagram: 'https://instagram.com/diariolx' },
    contact: { email: 'diariolx@escs.ipl.pt', address: 'Campus de Benfica do IPL\n1549-014 Lisboa' },
    navigation: { featuredCategories: [], showPhotos: true, showPodcasts: true, showVideos: true },
};

export const useSettingsMockService = (): SettingsService =>
    useMemo<SettingsService>(
        () => ({
            async fetch() {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return fakeSettings;
            },
            async save(settings) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                fakeSettings = settings;
            },
        }),
        [],
    );
