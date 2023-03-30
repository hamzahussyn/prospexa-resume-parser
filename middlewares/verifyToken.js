const JWT = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/exceptions');

async function verifyToken(req, res, next) {
  let userId = null;
  let email = null;

  const token = req.headers['x-access-token'];
  try {
    if (!token) throw new ErrorHandler(401, 'token is not recieved.');
    
    const decoded = JWT.verify(token, process.env.SECRET_KEY);
    if (!decoded) throw new ErrorHandler(401, 'failed to decode token.');

    userId = decoded.userId;
    email = decoded.email;
    role = decoded.role;
  } catch (error) {
    return next(error);
  }

  req.userVerification = { userId, email, role };
  next();
}

module.exports = {
  verifyToken
}
