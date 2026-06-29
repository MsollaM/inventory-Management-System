const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const {
  registerSchema,
  adminCreateUserSchema,
  loginSchema,
  approveSchema,
  idParam,
} = require('../schemas/authSchemas');
const {
  register,
  createUserByAdmin,
  login,
  getProfile,
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  toggleUserActive,
} = require('../controllers/authController');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', auth, getProfile);
router.get('/users', auth, roles('admin'), getAllUsers);
router.post('/users', auth, roles('admin'), validate(adminCreateUserSchema), createUserByAdmin);
router.get('/pending', auth, roles('admin'), getPendingUsers);
router.put('/approve/:id', auth, roles('admin'), validate(approveSchema), approveUser);
router.delete('/reject/:id', auth, roles('admin'), validate(idParam), rejectUser);
router.put('/toggle/:id', auth, roles('admin'), validate(idParam), toggleUserActive);

module.exports = router;
