const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Access denied. No valid bearer token provided.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Authentication is not configured.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'fullName', 'email', 'role', 'isActive', 'isApproved'],
    });

    if (!user || !user.isActive || !user.isApproved) {
      return res.status(401).json({ message: 'Account is not authorized.' });
    }

    req.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
