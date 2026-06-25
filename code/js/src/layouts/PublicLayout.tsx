import { useState } from 'react';
import { Outlet } from 'react-router';

import { Header } from '@/modules/public/Header';
import { Footer } from '@/modules/public/Footer';
import { ScrollToTop } from '@/shared/components/ScrollToTop';
import { PageThemeContext, type PageTheme } from '@/shared/hooks/usePageTheme';

export function PublicLayout() {
  const [theme, setTheme] = useState<PageTheme>('light');

  return (
    <PageThemeContext value={{ theme, setTheme }}>
      <ScrollToTop />
      <Header />
      <div style={{ paddingTop: 130 }}>
        <Outlet />
      </div>
      <Footer />
    </PageThemeContext>
  );
}
