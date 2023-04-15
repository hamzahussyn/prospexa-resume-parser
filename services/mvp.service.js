const fs = require('fs');

module.exports = {
  get,
  post,
};

function get(req, res, next) {
  res.render('form', { layout: false, title: 'Prospexa Resume Parser' });
}

function post(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      message: 'File is required.',
    });
  }
  console.log(req.body);
  console.log(req.file);

  fs.unlink(req.file.path, () => {
    console.log(`[server]: unlinked`, req.file.path);
  });
}