import { useContext } from 'react';
import { createContext } from 'react';

export type BootstrapState = {
  config: Config;
  links: Links;
  loading: boolean;
};

export type Config = object;

export type Links = {
  [key: string]: {
    href: string;
    method: string;
  };
};

export const BootstrapContext = createContext<BootstrapState>({
  config: {},
  links: {},
  loading: true
});

export function useBootstrap(): BootstrapState {
  const state: BootstrapState = useContext(BootstrapContext);
  return state;
}
