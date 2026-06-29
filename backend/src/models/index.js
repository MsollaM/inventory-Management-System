const User = require('./User');
const Asset = require('./Asset');
const Transaction = require('./Transaction');
const MaintenanceRecord = require('./MaintenanceRecord');
const StockItem = require('./StockItem');
const AuditLog = require('./AuditLog');

// Associations
Asset.hasMany(Transaction, { foreignKey: 'assetId' });
Transaction.belongsTo(Asset, { foreignKey: 'assetId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Asset.hasMany(MaintenanceRecord, { foreignKey: 'assetId' });
MaintenanceRecord.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = { User, Asset, Transaction, MaintenanceRecord, StockItem, AuditLog };