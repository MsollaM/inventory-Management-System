const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const {
  createAssetSchema,
  updateAssetSchema,
  idParam,
} = require('../schemas/assetSchemas');
const {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require('../controllers/assetController');

router.post('/', auth, roles('admin', 'store_manager'), validate(createAssetSchema), createAsset);
router.get('/', auth, getAllAssets);
router.get('/:id', auth, validate(idParam), getAssetById);
router.put('/:id', auth, roles('admin', 'store_manager'), validate(updateAssetSchema), updateAsset);
router.delete('/:id', auth, roles('admin'), validate(idParam), deleteAsset);

module.exports = router;
