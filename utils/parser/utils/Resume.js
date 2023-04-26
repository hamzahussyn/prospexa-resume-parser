var _ = require('underscore');

module.exports = function () {
  return new Resume();
};

function Resume() {
  // generic resume format
  this.parts = {};
  this.rawText = '';
}

Resume.prototype.addRawText = function (value) {
  value = value || '';
  value = value.trim();
  // reject falsy values
  if (value) this.rawText = value;
};

Resume.prototype.addKey = function (key, value) {
  value = value || '';
  value = value.trim();
  // reject falsy values
  if (value) {
    if (_.has(this.parts, key)) {
      value = this.parts[key] + '\n' + value;
    }

    this.parts[key] = value;
  }
};

Resume.prototype.addObject = function (key, options) {
  var self = this;

  if (!_.has(this.parts, key)) {
    this.parts[key] = {};
  }

  _.forEach(options, function (optionVal, optionName) {
    if (optionVal) {
      self.parts[key][optionName] = optionVal;
    }
  });
};

/**
 *
 * @returns {String}
 */
Resume.prototype.jsoned = function () {
  return JSON.stringify(this.parts);
};
