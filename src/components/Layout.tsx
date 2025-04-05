import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="container mx-auto px-4 pt-20 pb-8 max-w-4xl">
        {children}
      </main>
    </div>
  );
};

export default Layout; 