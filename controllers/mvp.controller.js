const router = require('express').Router();
const { upload } = require('../middlewares/multer');
const { get, post } = require('../services/mvp.service');

router
  .route('/')
  .get(get)
  .post([upload.single('file')],post);

module.exports = {
  MVPController: router,
};
