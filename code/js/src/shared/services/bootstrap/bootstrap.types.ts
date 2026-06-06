export type BootstrapData = {
    api: Endpoints;
};

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
    users: {
        me: Link;
        list: Link;
        create: Link;
        update: Link;
        delete: Link;
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
        getBySlug: Link;
        internalList: Link;
        internalGetById: Link;
        internalGetBySlug: Link;
        create: Link;
        update: Link;
        delete: Link;
        publish: Link;
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
        userSignedUrl: Link;
        completeUpload: Link;
    };
};

export interface BootstrapService {
    fetchBootstrapData(): Promise<BootstrapData>;
}
