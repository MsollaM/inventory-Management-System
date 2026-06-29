const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('admin', 'store_manager', 'field_supervisor', 'standard_user'),
    allowNull: false,
    defaultValue: 'standard_user',
  },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
  approvedBy: { type: DataTypes.INTEGER, allowNull: true },
  approvedAt: { type: DataTypes.DATE, allowNull: true },
  lastLogin: { type: DataTypes.DATE },
  loginAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  lockedUntil: { type: DataTypes.DATE },
}, {
  indexes: [
    { unique: true, fields: ['email'] },
    { fields: ['role'] },
    { fields: ['isApproved'] },
    { fields: ['isActive'] },
  ],
});

module.exports = User;
