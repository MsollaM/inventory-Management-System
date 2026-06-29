import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  assets: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  transactions: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  maintenance: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M20 12h2M2 12h2"/>
    </svg>
  ),
  stock: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
  ),
  reports: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
};

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['admin', 'store_manager', 'field_supervisor', 'standard_user'] },
  { path: '/assets', label: 'Assets', icon: 'assets', roles: ['admin', 'store_manager', 'field_supervisor', 'standard_user'] },
  { path: '/transactions', label: 'Transactions', icon: 'transactions', roles: ['admin', 'store_manager', 'field_supervisor', 'standard_user'] },
  { path: '/maintenance', label: 'Maintenance', icon: 'maintenance', roles: ['admin', 'store_manager'] },
  { path: '/stock', label: 'Stock', icon: 'stock', roles: ['admin', 'store_manager'] },
  { path: '/reports', label: 'Reports', icon: 'reports', roles: ['admin', 'store_manager'] },
  { path: '/users', label: 'Users', icon: 'users', roles: ['admin'] },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      <div style={{
        width: collapsed ? '70px' : '250px',
        minHeight: '100vh',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        transition: 'width 0.3s ease',
        zIndex: 200,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '70px',
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', minWidth: '36px',
                background: '#e67e22', borderRadius: '8px',
              }} />
              <div>
                <p style={{ color: 'white', margin: 0, fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>QR Code Construction</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', fontSize: '11px' }}>Inventory System</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ width: '36px', height: '36px', background: '#e67e22', borderRadius: '8px', margin: '0 auto' }} />
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              color: 'rgba(255,255,255,0.6)', width: '28px', height: '28px',
              borderRadius: '6px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', position: 'absolute', bottom: '80px', left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
        </div>

        {/* User */}
        {!collapsed && (
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '38px', height: '38px', minWidth: '38px',
              borderRadius: '50%', background: '#e67e22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '16px',
            }}>
              {user?.fullName?.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: 'white', margin: 0, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName}
              </p>
              <p style={{ color: '#e67e22', margin: '2px 0 0', fontSize: '11px', textTransform: 'capitalize' }}>
                {user?.role?.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {!collapsed && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', padding: '6px 8px 10px', margin: 0 }}>
              Navigation
            </p>
          )}
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ''}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                margin: '2px 0',
                borderRadius: '8px',
                color: isActive ? '#e67e22' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(230,126,34,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #e67e22' : '3px solid transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap',
              })}
            >
              <span style={{ flexShrink: 0 }}>{icons[item.icon]}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
            style={{
              width: '100%', padding: '10px 12px',
              background: 'rgba(214,48,49,0.1)',
              color: '#ff7675', border: '1px solid rgba(214,48,49,0.15)',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center',
              gap: '10px', cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;