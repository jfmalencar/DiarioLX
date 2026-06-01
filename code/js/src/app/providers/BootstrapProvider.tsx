import { useEffect, useState } from 'react';

import { BootstrapContext, type Endpoints, type Assets } from '@/shared/hooks/useBootstrap';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useBootstrapService } from '@/shared/services/bootstrap';

export const BootstrapProvider = ({ children }: { children: React.ReactNode }) => {
  const [endpoints, setEndpoints] = useState<Endpoints | null>(null);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const bootstrapService = useBootstrapService()

  useEffect(() => {
    async function loadConfig() {
      try {
        const { api, assets } = await bootstrapService.fetchBootstrapData();
        setEndpoints(api);
        setAssets(assets);
      } catch (error) {
        console.error('Erro ao carregar configurações do site', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [bootstrapService]);

  if (!ready || loading) {
    return <LoadingScreen onReady={() => setReady(true)} endProgress={50} />;
  }

  if (!endpoints || !assets) {
    return <div>Erro ao carregar configurações do site</div>;
  }

  return (
    <BootstrapContext value={{ assets, endpoints, loading }}>
      {children}
    </BootstrapContext>
  );
}
