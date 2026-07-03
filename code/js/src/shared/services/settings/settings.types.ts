export type BackofficeSettings = {
    social: { facebook: string; twitter: string; instagram: string };
    contact: { email: string; address: string };
    publication: { erc: string; periodicity: string; owner: string; nipc: string };
    navigation: {
        featuredCategories: string[];
        showPhotos: boolean;
        showPodcasts: boolean;
        showVideos: boolean;
    };
};

export interface SettingsService {
    fetch(): Promise<BackofficeSettings>;
    save(settings: BackofficeSettings): Promise<void>;
}
