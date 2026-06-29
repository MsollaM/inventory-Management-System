const { Op, where, col } = require('sequelize');
const { Asset, Transaction, User, StockItem } = require('../models/index');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalAssets,
      availableAssets,
      checkedOutAssets,
      underMaintenance,
      totalUsers,
      totalTransactions,
      lowStockItems,
    ] = await Promise.all([
      Asset.count(),
      Asset.count({ where: { status: 'available' } }),
      Asset.count({ where: { status: 'checked_out' } }),
      Asset.count({ where: { status: 'under_maintenance' } }),
      User.count(),
      Transaction.count(),
      StockItem.count({ where: where(col('quantity'), { [Op.lte]: col('minimumQuantity') }) }),
    ]);

    res.json({
      totalAssets,
      availableAssets,
      checkedOutAssets,
      underMaintenance,
      totalUsers,
      totalTransactions,
      lowStockItems,
    });
  } catch (err) {
    next(err);
  }
};
