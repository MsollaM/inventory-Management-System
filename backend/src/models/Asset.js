const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  serialNumber: { type: DataTypes.STRING, unique: true },
  qrCode: { type: DataTypes.STRING, unique: true },
  status: {
    type: DataTypes.ENUM('available', 'checked_out', 'under_maintenance', 'decommissioned'),
    defaultValue: 'available',
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good',
  },
  location: { type: DataTypes.STRING },
  purchaseDate: { type: DataTypes.DATE },
  purchaseCost: { type: DataTypes.DECIMAL(10, 2) },
  supplier: { type: DataTypes.STRING },
  warrantyExpiry: { type: DataTypes.DATE },
}, {
  indexes: [
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['location'] },
    { unique: true, fields: ['serialNumber'] },
    { unique: true, fields: ['qrCode'] },
    { fields: ['createdAt'] },
  ],
});

module.exports = Asset;
