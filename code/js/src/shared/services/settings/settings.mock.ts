import { useMemo } from 'react';

import type { SettingsService, BackofficeSettings } from './settings.types';

let fakeSettings: BackofficeSettings = {
    social: { facebook: 'https://facebook.com/diariolx', twitter: 'https://twitter.com/diariolx', instagram: 'https://instagram.com/diariolx' },
    contact: { email: 'diariolx@escs.ipl.pt', address: 'Campus de Benfica - Edifício Escola Superior de Comunicação Social, LIACOM - piso 1 549-014, Lisboa' },
    publication: {
        erc: '128219',
        periodicity: 'Diário',
        owner: 'Escola Superior de Comunicação Social (ESCS) - Instituto Politécnico de Lisboa',
        nipc: '508 519 713',
    },
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
