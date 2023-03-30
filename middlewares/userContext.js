const { User } = require('../models/user');
const { ErrorHandler } = require('../utils/exceptions');

async function userContext(req, res, next) {
  let userId = null;

  try {
    if (req.userVerification && req.userVerification.userId) {
      userId = req.userVerification.userId;
    }
    if (!userId) {
      throw new ErrorHandler(404, 'Verify token before calling context.');
    }
  } catch (error) {
    return next(error);
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ErrorHandler(404, 'Requested user does not exist.');
    }

    if (!req.context) req.context = new Object();
    req.context.user = user;
  } catch (error) {
    return next(error);
  }

  next();
}

module.exports = {
  userContext,
};
