/**
 * Module dependencies
 */

var stack = require('simple-stack-ui');
var envs = require('envs');
var format = require('url').format;

var app = module.exports = stack({
  restricted: true
});

app.useAfter('base', '/apps', function accessToken(req, res, next) {
  if (!req.query._access_token) return next();

  var basePath = (req.get('x-orig-path') || '') + req._parsedUrl.pathname;

  res.cookie('_access_token', req.query._access_token, {
    secure: ~req.base.indexOf('https://'),
    path: basePath
  });

  delete req.query._access_token;

  var href = format({
    pathname: basePath,
    query: req.query
  });

  res.redirect(href);
});

app.locals({
  env: {
    API_URL: '/api'
  }
});
