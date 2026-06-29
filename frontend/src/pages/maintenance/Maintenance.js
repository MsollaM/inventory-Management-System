import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getMaintenance, createMaintenance, updateMaintenance, getAssets } from '../../services/api';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetId: '', maintenanceType: '', description: '', technician: '', scheduledDate: '', cost: '' });

  const fetchData = () => {
    getMaintenance().then(res => setRecords(res.data)).catch(console.error);
    getAssets().then(res => setAssets(res.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenance(form);
      toast.success('Maintenance record created!');
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to create maintenance record.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateMaintenance(id, { status: 'completed', completedDate: new Date() });
      toast.success('Maintenance marked as completed!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update.');
    }
  };

  const statusColor = { scheduled: '#e67e22', in_progress: '#2980b9', completed: '#27ae60' };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#0f3460' }}>🛠️ Maintenance</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#0f3460', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? '✕ Cancel' : '+ Schedule Maintenance'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Asset</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} required>
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            {[['maintenanceType', 'Maintenance Type'], ['technician', 'Technician'], ['cost', 'Cost (TZS)']].map(([field, label]) => (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
                <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={label} required={field === 'maintenanceType'} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Scheduled Date</label>
              <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Description</label>
              <textarea style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', height: '80px' }}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the maintenance work" />
            </div>
            <div>
              <button type="submit" style={{ padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f3460', color: 'white' }}>
              {['Asset', 'Type', 'Technician', 'Scheduled Date', 'Cost', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No maintenance records found.</td></tr>
            ) : records.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{r.Asset?.name || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{r.maintenanceType}</td>
                <td style={{ padding: '12px 16px' }}>{r.technician || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '12px 16px' }}>{r.cost ? `TZS ${Number(r.cost).toLocaleString()}` : '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: statusColor[r.status] + '22', color: statusColor[r.status] }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {r.status !== 'completed' && (
                    <button onClick={() => handleComplete(r.id)} style={{ padding: '6px 12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      ✅ Complete
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

export default Maintenance;