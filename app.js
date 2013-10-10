/**
 * Module dependencies
 */

var stack = require('simple-stack-ui');
var envs = require('envs');

var app = module.exports = stack();

app.locals({
  env: {
    API_URL: '/api'
  }
})
