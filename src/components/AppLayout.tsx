import { ReactNode } from 'react';
import Header from '@/components/Header';

interface AppLayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  userName?: string;
}

const AppLayout = ({ children, isLoggedIn = false, userName }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} userName={userName} />
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-military-label">
            UNEFA — Capacitación Integral © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
