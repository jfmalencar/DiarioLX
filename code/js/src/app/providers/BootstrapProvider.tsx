import { useEffect, useState } from 'react';

import { BootstrapContext, type Endpoints, type Assets, type CreditRole } from '@/shared/hooks/useBootstrap';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useBootstrapService } from '@/shared/services/bootstrap';

export const BootstrapProvider = ({ children }: { children: React.ReactNode }) => {
  const [endpoints, setEndpoints] = useState<Endpoints | null>(null);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [creditRoles, setCreditRoles] = useState<CreditRole[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const bootstrapService = useBootstrapService();

  useEffect(() => {
    async function load() {
      try {
        const { api, assets, creditRoles } = await bootstrapService.fetchBootstrapData();
        setEndpoints(api);
        setAssets(assets);
        setCreditRoles(creditRoles);
      } catch (error) {
        console.error('Erro ao carregar configurações do site', error);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [bootstrapService]);

  const reload = async () => {
    const { api, assets, creditRoles } = await bootstrapService.fetchBootstrapData()
    setEndpoints(api);
    setAssets(assets);
    setCreditRoles(creditRoles);
    return { api }
  };

  if (!ready || loading) {
    return <LoadingScreen onReady={() => setReady(true)} endProgress={50} />;
  }

  if (!endpoints || !assets || !creditRoles) {
    return <div>Erro ao carregar configurações do site</div>;
  }

  return (
    <BootstrapContext value={{ assets, endpoints, creditRoles, loading, reload }}>
      {children}
    </BootstrapContext>
  );
};
