const sequelize = require('../config/database');
const { MaintenanceRecord, Asset } = require('../models/index');

const maintenanceFields = [
  'assetId',
  'maintenanceType',
  'description',
  'cost',
  'technician',
  'scheduledDate',
  'completedDate',
  'nextMaintenanceDate',
  'status',
];

const pick = (source, fields) => Object.fromEntries(
  fields.filter((field) => Object.prototype.hasOwnProperty.call(source, field)).map((field) => [field, source[field]])
);

exports.createMaintenance = async (req, res, next) => {
  const dbTx = await sequelize.transaction();

  try {
    const asset = await Asset.findByPk(req.body.assetId, {
      transaction: dbTx,
      lock: dbTx.LOCK.UPDATE,
    });

    if (!asset) {
      await dbTx.rollback();
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const record = await MaintenanceRecord.create(pick(req.body, maintenanceFields), { transaction: dbTx });
    await asset.update({ status: 'under_maintenance' }, { transaction: dbTx });

    await dbTx.commit();
    res.status(201).json({ message: 'Maintenance record created.', record });
  } catch (err) {
    await dbTx.rollback();
    next(err);
  }
};

exports.getAllMaintenance = async (req, res, next) => {
  try {
    const records = await MaintenanceRecord.findAll({
      include: [{ model: Asset, attributes: ['name', 'serialNumber'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.updateMaintenance = async (req, res, next) => {
  const dbTx = await sequelize.transaction();

  try {
    const record = await MaintenanceRecord.findByPk(req.params.id, {
      transaction: dbTx,
      lock: dbTx.LOCK.UPDATE,
    });

    if (!record) {
      await dbTx.rollback();
      return res.status(404).json({ message: 'Record not found.' });
    }

    await record.update(pick(req.body, maintenanceFields), { transaction: dbTx });

    if (req.body.status === 'completed') {
      await Asset.update(
        { status: 'available' },
        { where: { id: record.assetId }, transaction: dbTx }
      );
    }

    await dbTx.commit();
    res.json({ message: 'Maintenance record updated.', record });
  } catch (err) {
    await dbTx.rollback();
    next(err);
  }
};
