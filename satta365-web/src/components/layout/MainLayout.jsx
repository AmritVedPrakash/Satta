import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import DesktopFooter from './DesktopFooter';
import LanguageModal from './LanguageModal';

export const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  return (
    <div className="site-wrapper">
      <Navbar
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenLanguage={() => setLanguageModalOpen(true)}
      />

      <Sidebar
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />

      <main className="main-viewport">
        <div className="page-content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Desktop Footer (Hidden on Mobile) */}
      <DesktopFooter />

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <Footer />
    </div>
  );
};

export default MainLayout;
