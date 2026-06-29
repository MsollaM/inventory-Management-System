const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockItem = sequelize.define('StockItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
  },
  minimumQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 0 },
  },
  unitCost: {
    type: DataTypes.DECIMAL(10, 2),
    validate: { min: 0 },
  },
  location: {
    type: DataTypes.STRING,
  },
  unit: {
    type: DataTypes.STRING,
  },
}, {
  indexes: [
    { fields: ['category'] },
    { fields: ['location'] },
    { fields: ['quantity'] },
    { fields: ['minimumQuantity'] },
  ],
});

module.exports = StockItem;
