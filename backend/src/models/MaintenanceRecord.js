const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maintenanceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    validate: { min: 0 },
  },
  technician: {
    type: DataTypes.STRING,
  },
  scheduledDate: {
    type: DataTypes.DATE,
  },
  completedDate: {
    type: DataTypes.DATE,
  },
  nextMaintenanceDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed'),
    defaultValue: 'scheduled',
  },
}, {
  indexes: [
    { fields: ['assetId'] },
    { fields: ['status'] },
    { fields: ['scheduledDate'] },
    { fields: ['createdAt'] },
  ],
});

module.exports = MaintenanceRecord;
