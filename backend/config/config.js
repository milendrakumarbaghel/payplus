const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecretkey';
module.exports = { JWT_SECRET };
