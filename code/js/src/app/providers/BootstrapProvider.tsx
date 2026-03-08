import {
  useEffect,
  useState,
} from 'react';

import { BootstrapContext, type Config, type Links } from '@/shared/hooks/useBootstrap';

export function BootstrapProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [links, setLinks] = useState<Links | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { config, links } = await (await fetch('/api')).json();
        setConfig(config);
        setLinks(links);
      } catch (error) {
        console.error('Erro ao carregar configurações do site', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  if (loading) {
    return <div>Carregando configurações...</div>;
  }

  if (!config || !links) {
    return <div>Erro ao carregar configurações do site</div>;
  }

  return (
    <BootstrapContext value={{config, links, loading}}>
      {children}
    </BootstrapContext>
  );
}
