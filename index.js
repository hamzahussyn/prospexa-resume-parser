"use strict";

var resumeParser = require("./utils/parser");

/* Change the name of the file stored in resume directory */
var resume = "HamzaHussain-SE-2023.pdf";

function parser(name, cb) {
  resumeParser.parseResumeFile(`./resume/${name}`, "./parsed")
    .then((res) => cb(res))
    .catch((error) => console.log(error));
}

function main() {
  parser(resume, function(file) {
    console.log("parsed file -> ", file);
  });
}

main()