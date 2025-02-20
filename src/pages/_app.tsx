import { Providers } from '../providers/ToastProvider';
import { useAuth } from '../hooks/useAuth';
import { ROLE_PERMISSIONS } from '../types/roles';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ConsoleMonitor } from '@/utils/consoleMonitor';

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = useAuth();
  const userPermissions = user ? ROLE_PERMISSIONS[user.role]?.permissions : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize console monitoring
      const monitor = ConsoleMonitor.getInstance();

      // Optional: Log initial page load
      console.log('Page loaded:', window.location.pathname);
    }
  }, []);

  return (
    <Providers>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 p-2 bg-black text-white text-xs">
          Role: {user?.role}, Content Management: {String(userPermissions?.content_management)}
        </div>
      )}
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp; 