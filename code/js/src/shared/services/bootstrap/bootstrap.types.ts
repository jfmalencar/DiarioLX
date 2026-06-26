import type { SectionType } from "../contents/contents.types";

export type BootstrapData = {
    api: Endpoints;
    assets: Assets;
    creditRoles: CreditRole[]
    sections: SectionTypeConfig[]
    settings: SiteSettings
};

export type Assets = {
    publicMediaBaseUrl: string
}

export type NavCategory = {
    name: string;
    slug: string;
    color: string;
}

export type SiteSettings = {
    social: { facebook: string; twitter: string; instagram: string };
    contact: { email: string; address: string };
    navigation: {
        featured: NavCategory[];
        sections: NavCategory[];
        showPhotos: boolean;
        showPodcasts: boolean;
        showVideos: boolean;
    };
}

export type CreditRole = {
    value: string;
    label: string;
    byline: string;
    mediaTypes: string[]
}

export type Link = {
    href: string;
    method: string;
}

export type SectionTypeConfig = {
    type: SectionType;
    maxArticles: number;
    canBeAdded: boolean;
    hasCategory: boolean;
};

export type Endpoints = {
    auth: {
        register: Link;
        login: Link;
        logout: Link;
        refresh: Link;
        me: Link;
    }
    guest: {
        homepage: Link;
        listContent: Link;
        getContent: Link;
        team: Link;
        author: Link;
        tag: Link;
        category: Link;
    }
    backoffice: {
        users: {
            list: Link;
            create: Link;
            update: Link;
            delete: Link;
            status: Link;
            avatar: Link;
            setTeam: Link;
        }
        tags: {
            list: Link;
            get: Link;
            create: Link;
            update: Link;
            delete: Link;
            archive: Link;
            unarchive: Link;
        };
        categories: {
            list: Link;
            get: Link;
            create: Link;
            update: Link;
            delete: Link;
            archive: Link;
            unarchive: Link;
        };
        contents: {
            list: Link;
            getById: Link;
            internalList: Link;
            internalGetById: Link;
            internalGetHistory: Link;
            create: Link;
            update: Link;
            delete: Link;
            publish: Link;
            submit: Link;
            reject: Link;
            archive: Link;
        };
        invites: {
            list: Link;
            create: Link;
            delete: Link;
        }
        medias: {
            list: Link;
            create: Link;
            signedUrl: Link;
            completeUpload: Link;
        };
        featured: {
            get: Link;
            update: Link;
        }
        settings: {
            get: Link;
            update: Link;
        }
    }
};

export interface BootstrapService {
    fetchBootstrapData(): Promise<BootstrapData>;
}
