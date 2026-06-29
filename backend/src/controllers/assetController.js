const { Asset } = require('../models/index');

const assetFields = [
  'name',
  'category',
  'serialNumber',
  'qrCode',
  'status',
  'condition',
  'location',
  'purchaseDate',
  'purchaseCost',
  'supplier',
  'warrantyExpiry',
];

const pick = (source, fields) => Object.fromEntries(
  fields.filter((field) => Object.prototype.hasOwnProperty.call(source, field)).map((field) => [field, source[field]])
);

exports.createAsset = async (req, res, next) => {
  try {
    const asset = await Asset.create(pick(req.body, assetFields));
    res.status(201).json({ message: 'Asset created successfully.', asset });
  } catch (err) {
    next(err);
  }
};

exports.getAllAssets = async (req, res, next) => {
  try {
    const assets = await Asset.findAll({ order: [['createdAt', 'DESC']] });
    res.json(assets);
  } catch (err) {
    next(err);
  }
};

exports.getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    res.json(asset);
  } catch (err) {
    next(err);
  }
};

exports.updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    await asset.update(pick(req.body, assetFields));
    res.json({ message: 'Asset updated successfully.', asset });
  } catch (err) {
    next(err);
  }
};

exports.deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    await asset.destroy();
    res.json({ message: 'Asset deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
