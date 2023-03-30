const { ErrorHandler } = require('../utils/exceptions');

function authorize(role) {
  return function authorizeByRole(req, res, next) {
    let userRole = null;
    try {
      if (!req.userVerification) {
        throw new ErrorHandler(401, 'Verify token first.');
      }
      userRole = req.userVerification.role;
    } catch (error) {
      return next(error);
    }

    const multipleRoles = Array.isArray(role);
    if (multipleRoles) {
      const includes = role.includes(userRole);
      try {
        if (!includes) {
          throw new ErrorHandler(401, 'Unauthorized Request.');
        } else {
          return next();
        }
      } catch (error) {
        return next(error);
      }
    } else {
      try {
        if (role !== userRole) {
          throw new ErrorHandler(401, 'Unauthorized Request');
        } else {
          return next()
        }
      } catch (error) {
        return next(error);
      }
    }
  };
}

module.exports = {
  authorize,
};
