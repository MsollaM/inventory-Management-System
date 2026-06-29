const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const { createTransactionSchema } = require('../schemas/transactionSchemas');
const {
  createTransaction,
  getAllTransactions,
  getMyTransactions,
} = require('../controllers/transactionController');

router.post('/', auth, roles('admin', 'store_manager', 'field_supervisor'), validate(createTransactionSchema), createTransaction);
router.get('/', auth, roles('admin', 'store_manager'), getAllTransactions);
router.get('/my', auth, getMyTransactions);

module.exports = router;
