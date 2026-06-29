const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const {
  createStockSchema,
  updateStockSchema,
} = require('../schemas/stockSchemas');
const { idParam } = require('../schemas/commonSchemas');
const {
  createStockItem,
  getAllStockItems,
  updateStockItem,
  getLowStockItems,
} = require('../controllers/stockController');

router.post('/', auth, roles('admin', 'store_manager'), validate(createStockSchema), createStockItem);
router.get('/', auth, getAllStockItems);
router.get('/low-stock', auth, getLowStockItems);
router.put('/:id', auth, roles('admin', 'store_manager'), validate(updateStockSchema), updateStockItem);

module.exports = router;
