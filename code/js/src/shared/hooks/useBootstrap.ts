import { useContext } from 'react';
import { createContext } from 'react';

export type BootstrapState = {
  endpoints: Endpoints;
  loading: boolean;
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
    create: Link;
    update: Link;
    delete: Link;
    archive: Link;
    unarchive: Link;
  };
  categories: {
    list: Link;
    create: Link;
    update: Link;
    delete: Link;
    archive: Link;
    unarchive: Link;
  };
  contents: {
    list: Link;
    create: Link;
    update: Link;
    delete: Link;
    archive: Link;
    unarchive: Link;
  };
  invites: {
    list: Link;
    create: Link;
  }
  medias: {
    list: Link;
    create: Link;
    signedUrl: Link;
    userSignedUrl: Link;
    completeUpload: Link;
  };
};

export const BootstrapContext = createContext<BootstrapState | null>(null);

export function useBootstrap(): BootstrapState {
  const context = useContext(BootstrapContext);
  if (!context) {
    throw new Error('useBootstrap must be used inside BootstrapProvider');
  }
  return context;
}
