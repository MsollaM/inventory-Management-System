import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getStockItems, createStockItem, updateStockItem } from '../../services/api';
import toast from 'react-hot-toast';

const Stock = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', minimumQuantity: '5', unitCost: '', location: '', unit: '' });

  const fetchData = () => getStockItems().then(res => setItems(res.data)).catch(console.error);

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStockItem(form);
      toast.success('Stock item added!');
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add stock item.');
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#0f3460' }}>📦 Stock Management</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#0f3460', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? '✕ Cancel' : '+ Add Stock Item'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[['name', 'Item Name'], ['category', 'Category'], ['quantity', 'Quantity'], ['minimumQuantity', 'Minimum Quantity'], ['unitCost', 'Unit Cost (TZS)'], ['location', 'Storage Location'], ['unit', 'Unit (e.g. pcs, kg)']].map(([field, label]) => (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
                <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={label} required={field === 'name'} type={['quantity', 'minimumQuantity', 'unitCost'].includes(field) ? 'number' : 'text'} />
              </div>
            ))}
            <div>
              <button type="submit" style={{ padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f3460', color: 'white' }}>
              {['Item Name', 'Category', 'Quantity', 'Min. Qty', 'Unit Cost', 'Location', 'Status'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No stock items found.</td></tr>
            ) : items.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '12px 16px' }}>{item.category || '-'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: item.quantity <= item.minimumQuantity ? '#e94560' : '#27ae60' }}>{item.quantity} {item.unit}</td>
                <td style={{ padding: '12px 16px' }}>{item.minimumQuantity}</td>
                <td style={{ padding: '12px 16px' }}>{item.unitCost ? `TZS ${Number(item.unitCost).toLocaleString()}` : '-'}</td>
                <td style={{ padding: '12px 16px' }}>{item.location || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  {item.quantity <= item.minimumQuantity ? (
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: '#e9456022', color: '#e94560' }}>⚠️ Low Stock</span>
                  ) : (
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: '#27ae6022', color: '#27ae60' }}>✅ OK</span>
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

export default Stock;