const JWT = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const { Token } = require('../models/token');
const { User } = require('../models/user');
const { ErrorHandler } = require('../utils/exceptions');
const { hashPassword, verifyPassword } = require('../utils/security');

async function signup(req, res, next) {
  const unhashedPassword = req.body.password;
  const { salt, hash } = hashPassword(unhashedPassword);

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new ErrorHandler(400, 'The user already exists.');
    }
  } catch (error) {
    return next(error);
  }

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    salt: salt,
    password: hash,
  });

  try {
    await user.save();
  } catch (error) {
    return next(error);
  }

  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  const accessOptions = {
    expiresIn: '2d',
  };
  const refreshOptions = {
    expiresIn: '100d',
  };
  const accessToken = JWT.sign(payload, process.env.SECRET_KEY, accessOptions);
  const refreshToken = JWT.sign(payload, process.env.SECRET_KEY, refreshOptions);

  const token = new Token({
    token: accessToken,
    userId: user._id,
  });

  try {
    await token.save();
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({
    message: 'New Account has been created.',
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      auth: {
        accessToken: {
          token: token.token,
          expiresIn: accessOptions.expiresIn,
        },
      },
    },
  });
}

async function login(req, res, next) {
  let user = {};

  try {
    const isExistingUser = await User.findOne({ email: req.body.email });
    if (!isExistingUser) {
      throw new ErrorHandler(404, 'User not found.');
    }
    user = isExistingUser;
  } catch (error) {
    return next(error);
  }

  try {
    const isCorrectPassword = verifyPassword(req.body.password, user.salt, user.password);
    if (!isCorrectPassword) {
      throw new ErrorHandler(401, 'Incorrect email or password');
    }
  } catch (error) {
    return next(error);
  }

  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  const accessOptions = {
    expiresIn: '2d',
  };
  const refreshOptions = {
    expiresIn: '100d',
  };
  const accessToken = JWT.sign(payload, process.env.SECRET_KEY, accessOptions);
  const refreshToken = JWT.sign(payload, process.env.SECRET_KEY, refreshOptions);

  await Token.deleteOne({ userId: user._id });

  const token = new Token({
    token: accessToken,
    userId: user._id,
  });
  await token.save();

  return res.status(201).json({
    message: 'Logged in successfully.',
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      auth: {
        accessToken: token.token,
      },
    },
  });
}

async function logout(req, res, next) {
  const userId = req.userVerification.userId;

  try {
    await Token.deleteOne({ userId });
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({
    message: 'User logged out successfully.',
    status: true,
  });
}

async function me(req, res, next) {
  const user = req.context.user;

  try {
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    message: 'current requested user.',
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    },
  });
}

module.exports = {
  signup,
  login,
  me,
  logout,
};
