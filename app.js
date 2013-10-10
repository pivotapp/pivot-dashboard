/**
 * Module dependencies
 */

var stack = require('simple-stack-ui');
var envs = require('envs');

var app = module.exports = stack({cdn: envs('CDN_URL')});

app.locals({
  env: {
  API_URL: envs('API_URL')}
})
