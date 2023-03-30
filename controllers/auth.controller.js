const router = require('express').Router();
const { body } = require('express-validator');
const { RolesEnum } = require('../constants/roles');
const { authorize } = require('../middlewares/authorize');
const { userContext } = require('../middlewares/userContext');
const { validatePayload } = require('../middlewares/validatePayload');
const { verifyToken } = require('../middlewares/verifyToken');
const { signup, login, me, logout } = require('../services/auth.service');

router.post(
  '/signup',
  [
    body('firstName').notEmpty().isString().withMessage('First Name is a required field.'),
    body('lastName').notEmpty().isString().withMessage('Last Name is a required field.'),
    body('email').notEmpty().isEmail().withMessage('Enter a valid email.'),
    body('password')
      .isString()
      .isLength({ min: 8 })
      .withMessage('Password is required of mimunim 8 chars.'),
    validatePayload,
  ],
  signup
);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password')
      .isString()
      .isLength({ min: 8 })
      .withMessage('Password is required of mimunim 8 chars.'),
    validatePayload,
  ],
  login
);
router.post('/logout', [verifyToken], logout);
router.get('/me', [verifyToken, userContext, authorize(RolesEnum.USER)], me);

module.exports = {
  AuthController: router,
};
