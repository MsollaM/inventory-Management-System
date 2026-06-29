import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Register from './Register';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) return <Register onBack={() => setShowRegister(false)} />;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#f5f6fa', fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #1a1a2e 0%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', background: 'rgba(230,126,34,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-80px', width: '450px', height: '450px', background: 'rgba(230,126,34,0.05)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '380px', width: '100%' }}>
          <div style={{ width: '56px', height: '56px', background: '#e67e22', borderRadius: '14px', marginBottom: '32px' }} />
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: '0 0 16px', lineHeight: '1.2' }}>
            QR Code Construction<br />Company Ltd
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 40px' }}>
            Inventory Management System for real-time tracking of tools, equipment, and materials across all project sites.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Asset Tracking', desc: 'Real-time visibility' },
              { label: 'Role-Based Access', desc: 'Secure permissions' },
              { label: 'QR Code Scanning', desc: 'Fast check-in/out' },
              { label: 'Analytics Reports', desc: 'Data-driven decisions' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px' }}>
                <p style={{ color: 'white', margin: '0 0 3px', fontSize: '12px', fontWeight: 600 }}>{f.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', margin: 0, fontSize: '11px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '460px', minWidth: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', background: 'white' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#2d3436', margin: '0 0 8px' }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#636e72', margin: 0, fontSize: '13px' }}>
            Enter your credentials to access the system
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '7px', fontWeight: 600, fontSize: '12px', color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <input
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #dfe6e9', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#f5f6fa', color: '#2d3436' }}
              type="email" placeholder="Enter your email"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '7px', fontWeight: 600, fontSize: '12px', color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ width: '100%', padding: '12px 48px 12px 14px', border: '1.5px solid #dfe6e9', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#f5f6fa', color: '#2d3436' }}
                type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#636e72', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#b2bec3' : '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '16px', background: '#f5f6fa', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#636e72' }}>
            New to the system? Request access below.
          </p>
          <button onClick={() => setShowRegister(true)} style={{ width: '100%', padding: '12px', background: 'white', color: '#e67e22', border: '2px solid #e67e22', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            Request Account Access
          </button>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #dfe6e9', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#b2bec3' }}>
            © 2026 QR Code Construction Company Ltd · Arusha, Tanzania
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#b2bec3' }}>
            Contact your administrator if you cannot access your account.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="flex: 1"] { display: none !important; }
          div[style*="width: 460px"] { width: 100% !important; min-width: unset !important; padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;