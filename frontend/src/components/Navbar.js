import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your inventory system' },
  '/assets': { title: 'Assets', subtitle: 'Manage tools and equipment' },
  '/transactions': { title: 'Transactions', subtitle: 'Track check-in and check-out activity' },
  '/maintenance': { title: 'Maintenance', subtitle: 'Schedule and track maintenance records' },
  '/stock': { title: 'Stock Management', subtitle: 'Monitor consumables and supplies' },
  '/reports': { title: 'Reports & Analytics', subtitle: 'View insights and performance data' },
  '/users': { title: 'User Management', subtitle: 'Manage system users and access roles' },
};

const Navbar = ({ sidebarCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'Inventory System', subtitle: '' };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0,
      left: sidebarCollapsed ? '70px' : '250px',
      height: '70px', background: 'white',
      boxShadow: '0 1px 0 #dfe6e9',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px', zIndex: 99,
      transition: 'left 0.3s ease',
    }}>

      {/* Page Title */}
      <div>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#2d3436' }}>
          {page.title}
        </h1>
        <p style={{ margin: 0, fontSize: '12px', color: '#b2bec3' }}>
          {page.subtitle}
        </p>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Date - hidden on small screens */}
        <p style={{ margin: 0, fontSize: '12px', color: '#b2bec3', whiteSpace: 'nowrap' }}
          className="hide-mobile">
          {dateStr}
        </p>

        {/* Divider */}
        <div style={{ width: '1px', height: '32px', background: '#dfe6e9' }} className="hide-mobile" />

        {/* User info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px',
          background: '#f5f6fa', borderRadius: '8px',
        }}>
          <div style={{
            width: '32px', height: '32px',
            background: '#e67e22', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0,
          }}>
            {user?.fullName?.charAt(0)}
          </div>
          <div className="hide-mobile">
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#2d3436' }}>
              {user?.fullName}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#e67e22', textTransform: 'capitalize' }}>
              {user?.role?.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Navbar;