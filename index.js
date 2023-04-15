'use strict';

var resumeParser = require('./utils/parser');
var fs = require('fs');
var resume = 'CV.pdf';

function parser(name, cb) {
  resumeParser
    .parseResumeFile(`./resume/${name}`, './parsed')
    .then((res) => cb(res))
    .catch((error) => console.log(error));
}

function main() {
  if (!resume) {
    let resumes = fs.readdirSync('./resume');
    for (let resume of resumes) {
      parser(resume, function (file) {
        console.log('parsed file -> ', file);
      });
    }
    return;
  }
  parser(resume, function (file) {
    console.log('parsed file -> ', file);
  });
}

main();
