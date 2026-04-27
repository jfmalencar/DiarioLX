import { Outlet } from 'react-router';

import { Header } from '@/modules/public/Header';
import { Footer } from '@/modules/public/Footer';

export function PublicLayout() {
  return (
    <div className='bg-light' >
      <Header />
      <div style={{ paddingTop: 150 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
