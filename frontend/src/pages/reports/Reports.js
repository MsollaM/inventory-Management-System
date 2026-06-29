import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getDashboardStats, getAssets, getTransactions } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getDashboardStats().then(res => setStats(res.data)).catch(console.error);
    getAssets().then(res => setAssets(res.data)).catch(console.error);
    getTransactions().then(res => setTransactions(res.data)).catch(console.error);
  }, []);

  const pieData = stats ? [
    { name: 'Available', value: stats.availableAssets, color: '#27ae60' },
    { name: 'Checked Out', value: stats.checkedOutAssets, color: '#e67e22' },
    { name: 'Maintenance', value: stats.underMaintenance, color: '#e94560' },
  ] : [];

  const categoryData = assets.reduce((acc, asset) => {
    const found = acc.find(a => a.category === asset.category);
    if (found) found.count++;
    else acc.push({ category: asset.category || 'Uncategorized', count: 1 });
    return acc;
  }, []);

  return (
    <Layout>
      <h1 style={{ margin: '0 0 24px', color: '#0f3460' }}>📈 Reports & Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', color: '#333' }}>Asset Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', color: '#333' }}>Assets by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f3460" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>📋 Recent Transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['Asset', 'User', 'Type', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((tx, i) => (
              <tr key={tx.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}>{tx.Asset?.name || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{tx.User?.fullName || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: tx.type === 'checkout' ? '#e67e22' : '#27ae60', fontWeight: 'bold' }}>
                    {tx.type === 'checkout' ? '📤 Check Out' : '📥 Check In'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Reports;