import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}>

      {/* Mobile overlay background */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 150, display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{
        marginLeft: collapsed ? '70px' : '250px',
        flex: 1,
        transition: 'margin-left 0.3s ease',
        minWidth: 0,
      }}>
        <Navbar sidebarCollapsed={collapsed} />
        <main style={{
          padding: '24px',
          marginTop: '70px',
          minHeight: 'calc(100vh - 70px)',
        }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;