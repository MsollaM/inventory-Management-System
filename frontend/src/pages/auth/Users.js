import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import {
  getAllUsers,
  getPendingUsers,
  createUser,
  approveUser,
  rejectUser,
  toggleUserActive,
} from '../../services/api';

const roleOptions = [
  ['standard_user', 'Standard User'],
  ['field_supervisor', 'Field Supervisor'],
  ['store_manager', 'Store Manager'],
  ['admin', 'Admin'],
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [tab, setTab] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'standard_user' });
  const [selectedRole, setSelectedRole] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, pendingRes] = await Promise.all([
        getAllUsers(),
        getPendingUsers(),
      ]);
      setUsers(usersRes.data.filter((u) => u.isApproved));
      setPending(pendingRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users.');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setSaving(true);
    try {
      await createUser(form);
      toast.success('User created successfully.');
      setShowForm(false);
      setForm({ fullName: '', email: '', password: '', role: 'standard_user' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const role = selectedRole[id] || 'standard_user';
      await approveUser(id, { role });
      toast.success('User approved successfully.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve user.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this registration?')) return;
    try {
      await rejectUser(id);
      toast.success('Registration rejected.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject user.');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleUserActive(id);
      toast.success('User status updated.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const roleColor = {
    admin: '#d63031',
    store_manager: '#8e44ad',
    field_supervisor: '#0984e3',
    standard_user: '#00b894',
  };

  const tabStyle = (active) => ({
    padding: '10px 20px', border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: '13px', borderRadius: '8px',
    background: active ? '#e67e22' : 'transparent',
    color: active ? 'white' : '#636e72',
    transition: 'all 0.15s',
  });

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#2d3436' }}>User Management</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
          {showForm ? 'Cancel' : '+ Add User Directly'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: 'white', padding: '6px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: 'fit-content' }}>
        <button style={tabStyle(tab === 'active')} onClick={() => setTab('active')}>
          Active Users ({users.length})
        </button>
        <button style={tabStyle(tab === 'pending')} onClick={() => setTab('pending')}>
          Pending Approval
          {pending.length > 0 && (
            <span style={{ marginLeft: '8px', background: '#d63031', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '11px' }}>
              {pending.length}
            </span>
          )}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Create User Directly</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[['fullName', 'Full Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password', 'password']].map(([field, label, type]) => (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
                <input type={type} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #dfe6e9', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', background: '#f5f6fa' }}
                  placeholder={field === 'password' ? 'Minimum 8 characters' : ''}
                  value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</label>
              <select style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #dfe6e9', borderRadius: '8px', fontSize: '13px', background: '#f5f6fa' }}
                value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" disabled={saving} style={{ padding: '11px 24px', background: saving ? '#b2bec3' : '#00b894', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '13px' }}>
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'pending' && (
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {pending.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#636e72' }}>
              <p style={{ fontWeight: 600, marginBottom: '6px' }}>No pending registrations</p>
              <p style={{ fontSize: '13px' }}>All registration requests have been processed.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a2e', color: 'white' }}>
                  {['Full Name', 'Email', 'Registered', 'Assign Role', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '14px' }}>{u.fullName}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#636e72' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#636e72' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        style={{ padding: '7px 10px', border: '1.5px solid #dfe6e9', borderRadius: '6px', fontSize: '12px', background: 'white' }}
                        value={selectedRole[u.id] || 'standard_user'}
                        onChange={(e) => setSelectedRole({ ...selectedRole, [u.id]: e.target.value })}>
                        {roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApprove(u.id)}
                        style={{ padding: '7px 14px', background: '#00b894', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(u.id)}
                        style={{ padding: '7px 14px', background: '#d63031', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'active' && (
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                {['Full Name', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: '#636e72' }}>No active users found.</td></tr>
              ) : users.map((u, i) => (
                <tr key={u.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '14px' }}>{u.fullName}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#636e72' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: (roleColor[u.role] || '#636e72') + '20', color: roleColor[u.role] || '#636e72', textTransform: 'capitalize' }}>
                      {u.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#636e72' }}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: u.isActive ? '#00b89420' : '#d6303120', color: u.isActive ? '#00b894' : '#d63031' }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => handleToggle(u.id)}
                      style={{ padding: '6px 12px', background: u.isActive ? '#d6303115' : '#00b89415', color: u.isActive ? '#d63031' : '#00b894', border: `1px solid ${u.isActive ? '#d63031' : '#00b894'}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Users;
