const fs = require('fs');
var resumeParser = require('../utils/parser');

module.exports = {
  get,
  post,
};

function isGithub(key) {
  return key === 'github';
}

function get(req, res, next) {
  res.render('form', {
    layout: false,
    title: 'Prospexa Resume Parser',
  });
}

function post(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      message: 'File is required.',
    });
  }
  // console.log(req.body);
  // console.log(req.file);

  resumeParser.parseResumeFile(req.file.path, './parsed').then(() => {
    fs.readFile(`parsed/${req.file.filename}.json`, function (err, data) {
      if (err) throw err;
      var json = JSON.parse(data);

      res.render('result', {
        layout: false,
        result: JSON.parse(data),
        isGithub,
      });
    });

    fs.unlink(req.file.path, () => {
      console.log(`[server]: unlinked`, req.file.path);
    });
  });
}
