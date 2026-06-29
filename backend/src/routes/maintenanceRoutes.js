const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const {
  createMaintenanceSchema,
  updateMaintenanceSchema,
} = require('../schemas/maintenanceSchemas');
const {
  createMaintenance,
  getAllMaintenance,
  updateMaintenance,
} = require('../controllers/maintenanceController');

router.post('/', auth, roles('admin', 'store_manager'), validate(createMaintenanceSchema), createMaintenance);
router.get('/', auth, getAllMaintenance);
router.put('/:id', auth, roles('admin', 'store_manager'), validate(updateMaintenanceSchema), updateMaintenance);

module.exports = router;
