/**
 * Module dependencies
 */

var format = require('url').format;

/**
 * Create an handler to set access tokens for an app path
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function ssoAccessToken(req, res, next) {
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
  };
};