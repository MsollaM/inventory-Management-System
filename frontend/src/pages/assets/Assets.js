import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getAssets, createAsset, deleteAsset } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Assets = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', serialNumber: '', location: '', condition: 'good', purchaseCost: '' });

  const fetchAssets = () => getAssets().then(res => setAssets(res.data)).catch(console.error);

  useEffect(() => { fetchAssets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAsset(form);
      toast.success('Asset created successfully!');
      setShowForm(false);
      setForm({ name: '', category: '', serialNumber: '', location: '', condition: 'good', purchaseCost: '' });
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create asset.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAsset(id);
      toast.success('Asset deleted.');
      fetchAssets();
    } catch (err) {
      toast.error('Failed to delete asset.');
    }
  };

  const statusColor = { available: '#27ae60', checked_out: '#e67e22', under_maintenance: '#e94560', decommissioned: '#95a5a6' };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#0f3460' }}>🔧 Assets</h1>
        {['admin', 'store_manager'].includes(user?.role) && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#0f3460', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showForm ? '✕ Cancel' : '+ Add Asset'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 16px' }}>Add New Asset</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[['name', 'Asset Name'], ['category', 'Category'], ['serialNumber', 'Serial Number'], ['location', 'Location'], ['purchaseCost', 'Purchase Cost (TZS)']].map(([field, label]) => (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
                <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={label} required={['name', 'category'].includes(field)} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Condition</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" style={{ padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f3460', color: 'white' }}>
              {['Name', 'Category', 'Serial Number', 'Location', 'Condition', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No assets found. Add your first asset!</td></tr>
            ) : assets.map((asset, i) => (
              <tr key={asset.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{asset.name}</td>
                <td style={{ padding: '12px 16px' }}>{asset.category}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{asset.serialNumber || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{asset.location || '-'}</td>
                <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{asset.condition}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: statusColor[asset.status] + '22', color: statusColor[asset.status] }}>
                    {asset.status?.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(asset.id)} style={{ padding: '6px 12px', background: '#e94560', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Assets;