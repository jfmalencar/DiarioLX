import { useEffect, useState } from 'react';

import { BootstrapContext, type Endpoints, type Assets, type CreditRole, type SectionTypeConfig, type SiteSettings } from '@/shared/hooks/useBootstrap';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { SiteError } from '@/shared/components/SiteError';
import { useBootstrapService } from '@/shared/services/bootstrap';

export const BootstrapProvider = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<SectionTypeConfig[] | null>(null);
  const [endpoints, setEndpoints] = useState<Endpoints | null>(null);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [creditRoles, setCreditRoles] = useState<CreditRole[] | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const bootstrapService = useBootstrapService();

  useEffect(() => {
    async function load() {
      try {
        const { api, assets, creditRoles, sections, settings } = await bootstrapService.fetchBootstrapData();
        setEndpoints(api);
        setAssets(assets);
        setCreditRoles(creditRoles);
        setSections(sections);
        setSettings(settings);
      } catch (error) {
        console.error('Erro ao carregar configurações do site', error);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [bootstrapService]);

  const reload = async () => {
    const { api, assets, creditRoles, sections, settings } = await bootstrapService.fetchBootstrapData()
    setEndpoints(api);
    setAssets(assets);
    setCreditRoles(creditRoles);
    setSections(sections);
    setSettings(settings);
    return { api }
  };

  if (!ready || loading) {
    return <LoadingScreen onReady={() => setReady(true)} endProgress={50} />;
  }

  if (!endpoints || !assets || !creditRoles || !sections || !settings) {
    return <SiteError />;
  }

  return (
    <BootstrapContext value={{ assets, endpoints, creditRoles, sections, settings, loading, reload }}>
      {children}
    </BootstrapContext>
  );
};
