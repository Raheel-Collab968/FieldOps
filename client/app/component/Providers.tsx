'use client';

import { App } from 'antd';
import { AppProvider } from '@/app/context/AppContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <App>
      <AppProvider>
        {children}
      </AppProvider>
    </App>
  );
}
