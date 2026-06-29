import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getDashboardStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, subtitle, color, icon }) => (
  <div style={{
    background: 'white', borderRadius: '10px',
    padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    borderTop: `4px solid ${color}`,
    display: 'flex', alignItems: 'center', gap: '18px',
  }}>
    <div style={{
      width: '52px', height: '52px', minWidth: '52px',
      background: color + '14', borderRadius: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: '0 0 4px', color: '#636e72', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <h2 style={{ margin: '0 0 3px', fontSize: '28px', fontWeight: 800, color: '#2d3436' }}>{value}</h2>
      <p style={{ margin: 0, fontSize: '12px', color }}>{subtitle}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <p style={{ color: '#050606', fontSize: '15px' }}>Loading...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        borderRadius: '12px', padding: '28px 32px',
        marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: '20px', fontWeight: 700 }}>
            {greeting}, {user?.fullName?.split(' ')[0]}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', margin: 0, fontSize: '13px' }}>
            Here is your inventory overview for today.
          </p>
        </div>
        <div style={{
          background: 'rgba(230,126,34,0.2)',
          border: '1px solid rgba(230,126,34,0.3)',
          borderRadius: '8px', padding: '10px 18px',
        }}>
          <p style={{ color: '#e67e22', margin: 0, fontSize: '13px', fontWeight: 600 }}>
            QR Code Construction Company Ltd
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', margin: '2px 0 0', fontSize: '11px' }}>
            Arusha, Tanzania
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '24px',
      }}>
        <StatCard title="Total Assets" value={stats?.totalAssets || 0} subtitle="All registered items" color="#0984e3"
          icon={<svg width="22" height="22" fill="none" stroke="#0984e3" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>}
        />
        <StatCard title="Available" value={stats?.availableAssets || 0} subtitle="Ready for use" color="#00b894"
          icon={<svg width="22" height="22" fill="none" stroke="#00b894" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard title="Checked Out" value={stats?.checkedOutAssets || 0} subtitle="Currently in use" color="#e67e22"
          icon={<svg width="22" height="22" fill="none" stroke="#e67e22" strokeWidth="2" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>}
        />
        <StatCard title="Maintenance" value={stats?.underMaintenance || 0} subtitle="Being serviced" color="#d63031"
          icon={<svg width="22" height="22" fill="none" stroke="#d63031" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M20 12h2M2 12h2"/></svg>}
        />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} subtitle="System accounts" color="#8e44ad"
          icon={<svg width="22" height="22" fill="none" stroke="#8e44ad" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
        />
        <StatCard title="Transactions" value={stats?.totalTransactions || 0} subtitle="Total recorded" color="#00cec9"
          icon={<svg width="22" height="22" fill="none" stroke="#00cec9" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>}
        />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '14px', fontWeight: 700, color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Add Asset', path: '/assets', color: '#0984e3' },
              { label: 'New Transaction', path: '/transactions', color: '#e67e22' },
              { label: 'Maintenance', path: '/maintenance', color: '#d63031' },
              { label: 'View Reports', path: '/reports', color: '#8e44ad' },
            ].map((action, i) => (
              <a key={i} href={action.path} style={{
                padding: '14px', background: '#f5f6fa',
                borderRadius: '8px', textAlign: 'center',
                display: 'block', textDecoration: 'none',
                border: '1.5px solid transparent',
                transition: 'all 0.15s',
                color: '#2d3436', fontSize: '13px', fontWeight: 600,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.color = action.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#2d3436'; }}>
                {action.label}
              </a>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '14px', fontWeight: 700, color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            System Information
          </h3>
          {[
            { label: 'System', value: 'Web-Based IMS v1.0' },
            { label: 'Company', value: 'QR Code Construction Co.' },
            { label: 'Location', value: 'Arusha, Tanzania' },
            { label: 'Your Role', value: user?.role?.replace(/_/g, ' '), accent: true },
            { label: 'Security', value: 'JWT + RBAC + Rate Limiting' },
            { label: 'Database', value: 'MySQL (Indexed)' },
          ].map((info, i, arr) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '9px 0',
              borderBottom: i < arr.length - 1 ? '1px solid #f5f6fa' : 'none',
            }}>
              <span style={{ color: '#636e72', fontSize: '13px' }}>{info.label}</span>
              <span style={{
                fontSize: '13px', fontWeight: 600,
                color: info.accent ? '#e67e22' : '#2d3436',
                textTransform: info.accent ? 'capitalize' : 'none',
              }}>{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          main { padding: 16px !important; }
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;