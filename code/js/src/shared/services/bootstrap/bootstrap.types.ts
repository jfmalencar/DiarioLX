export type BootstrapData = {
    api: Endpoints;
    assets: Assets;
    creditRoles: CreditRole[]
};

export type Assets = {
    publicMediaBaseUrl: string
}

export type CreditRole = {
    value: string;
    label: string;
    mediaTypes: string[]
}

export type Link = {
    href: string;
    method: string;
}

export type Endpoints = {
    auth: {
        register: Link;
        login: Link;
        logout: Link;
        refresh: Link;
    }
    guest: {
        homepage: Link;
        listContent: Link;
        getContent: Link;
    }
    backoffice: {
        users: {
            me: Link;
            list: Link;
            create: Link;
            update: Link;
            delete: Link;
            avatar: Link;
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
    }
};

export interface BootstrapService {
    fetchBootstrapData(): Promise<BootstrapData>;
}
