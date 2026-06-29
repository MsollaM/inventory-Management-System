const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assetId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('checkout', 'checkin'), allowNull: false },
  expectedReturnDate: { type: DataTypes.DATE },
  actualReturnDate: { type: DataTypes.DATE },
  conditionAtCheckout: { type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor') },
  conditionAtReturn: { type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor') },
  notes: { type: DataTypes.TEXT },
  isOverdue: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  indexes: [
    { fields: ['assetId'] },
    { fields: ['userId'] },
    { fields: ['type'] },
    { fields: ['createdAt'] },
    { fields: ['expectedReturnDate'] },
  ],
});

module.exports = Transaction;
