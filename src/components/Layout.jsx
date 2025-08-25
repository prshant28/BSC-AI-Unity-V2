import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { LogOut, UserCog } from 'lucide-react';

const Layout = ({ isAdminAuthenticated, handleAdminLogout }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminPage && <Header />}
      {isAdminPage && isAdminAuthenticated && (
        <header className="sticky top-0 z-50 w-full border-b bg-secondary text-secondary-foreground">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <UserCog className="h-7 w-7" />
              <span className="text-xl font-bold">Admin Panel - BScAI Unity</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleAdminLogout} className="hover:bg-secondary-foreground/10 text-secondary-foreground">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
      )}
      <main className="flex-grow bg-background">
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
      <Toaster />
    </div>
  );
};

export default Layout;