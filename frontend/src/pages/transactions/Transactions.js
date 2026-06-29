import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getTransactions, getMyTransactions, createTransaction, getAssets } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetId: '', type: 'checkout', expectedReturnDate: '', notes: '' });

  const fetchData = () => {
    const fetchTx = ['admin', 'store_manager'].includes(user?.role) ? getTransactions() : getMyTransactions();
    fetchTx.then(res => setTransactions(res.data)).catch(console.error);
    getAssets().then(res => setAssets(res.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(form);
      toast.success(`Asset ${form.type} successful!`);
      setShowForm(false);
      setForm({ assetId: '', type: 'checkout', expectedReturnDate: '', notes: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed.');
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#0f3460' }}>🔄 Transactions</h1>
        {['admin', 'store_manager', 'field_supervisor'].includes(user?.role) && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#0f3460', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showForm ? '✕ Cancel' : '+ New Transaction'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 16px' }}>New Transaction</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Asset</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} required>
                <option value="">Select Asset</option>
                {assets.filter(a => a.status === 'available').map(a => (
                  <option key={a.id} value={a.id}>{a.name} - {a.serialNumber}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Type</label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="checkout">Check Out</option>
                <option value="checkin">Check In</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Expected Return Date</label>
              <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                value={form.expectedReturnDate} onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Notes</label>
              <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" style={{ padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Submit Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f3460', color: 'white' }}>
              {['Asset', 'User', 'Type', 'Expected Return', 'Notes', 'Date'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No transactions found.</td></tr>
            ) : transactions.map((tx, i) => (
              <tr key={tx.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{tx.Asset?.name || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{tx.User?.fullName || user?.fullName}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: tx.type === 'checkout' ? '#e67e2222' : '#27ae6022', color: tx.type === 'checkout' ? '#e67e22' : '#27ae60' }}>
                    {tx.type === 'checkout' ? '📤 Check Out' : '📥 Check In'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>{tx.expectedReturnDate ? new Date(tx.expectedReturnDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '12px 16px' }}>{tx.notes || '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Transactions;