module.exports = {
  contentSecurityPolicy: {
    directives: {
      'script-src': ["'self'", '127.0.0.1', 'prospexa.live', "'unsafe-inline'"],
      'style-src': [
        "'self'",
        '127.0.0.1',
        'prospexa.live',
        "'unsafe-inline'",
        'fonts.cdnfonts.com',
      ],
      'frame-src': ["'self'", 'blob:'],
    },
  },
};
