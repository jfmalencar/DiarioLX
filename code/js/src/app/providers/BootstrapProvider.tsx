import { useEffect, useState } from 'react';

import { BootstrapContext, type Endpoints } from '@/shared/hooks/useBootstrap';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { bootstrapService } from '@/shared/services/bootstrap';

export const BootstrapProvider = ({ children }: { children: React.ReactNode }) => {
  const [endpoints, setEndpoints] = useState<Endpoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  console.log('BootstrapProvider rendered with endpoints:', endpoints);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { endpoints } = await bootstrapService.fetchBootstrapData();
        setEndpoints(endpoints);
      } catch (error) {
        console.error('Erro ao carregar configurações do site', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  if (!ready || loading) {
    return <LoadingScreen onReady={() => setReady(true)} endProgress={50} />;
  }

  if (!endpoints) {
    return <div>Erro ao carregar configurações do site</div>;
  }

  return (
    <BootstrapContext value={{ endpoints, loading }}>
      {children}
    </BootstrapContext>
  );
}
