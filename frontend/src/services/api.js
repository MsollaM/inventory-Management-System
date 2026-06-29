import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const getAllUsers = () => API.get('/auth/users');
export const createUser = (data) => API.post('/auth/users', data);
export const getPendingUsers = () => API.get('/auth/pending');
export const approveUser = (id, data) => API.put(`/auth/approve/${id}`, data);
export const rejectUser = (id) => API.delete(`/auth/reject/${id}`);
export const toggleUserActive = (id) => API.put(`/auth/toggle/${id}`);

// Assets
export const getAssets = () => API.get('/assets');
export const getAsset = (id) => API.get(`/assets/${id}`);
export const createAsset = (data) => API.post('/assets', data);
export const updateAsset = (id, data) => API.put(`/assets/${id}`, data);
export const deleteAsset = (id) => API.delete(`/assets/${id}`);

// Transactions
export const getTransactions = () => API.get('/transactions');
export const getMyTransactions = () => API.get('/transactions/my');
export const createTransaction = (data) => API.post('/transactions', data);

// Maintenance
export const getMaintenance = () => API.get('/maintenance');
export const createMaintenance = (data) => API.post('/maintenance', data);
export const updateMaintenance = (id, data) => API.put(`/maintenance/${id}`, data);

// Stock
export const getStockItems = () => API.get('/stock');
export const createStockItem = (data) => API.post('/stock', data);
export const updateStockItem = (id, data) => API.put(`/stock/${id}`, data);

// Reports
export const getDashboardStats = () => API.get('/reports/dashboard');

export default API;
