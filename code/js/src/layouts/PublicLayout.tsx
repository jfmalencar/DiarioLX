import { Outlet } from 'react-router';

import { Header } from '@/modules/public/Header';
import { Footer } from '@/modules/public/Footer';

export function PublicLayout() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: 130 }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
