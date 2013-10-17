/**
 * Module dependencies
 */

var app = require('.');
var envs = require('envs');
var token = require('access-token');

/**
 * Load the environment
 */

if (window.env) envs.set(window.env);

/**
 * Initialize the client
 */

var client = require('hyperagent');

/**
 * Pass the access token on all of the requests
 */

client.set(token.auth());

/**
 * Initialize the controllers
 */

var IndexController = require('./controllers/index');
var HyperController = require('./controllers/hyper');

/**
 * Initialize the directives
 */

require('./directives/hyper');
require('./directives/hyper-bind');
require('./directives/hyper-form');
require('./directives/hyper-input');
require('./directives/hyper-link');
require('./directives/d3-line-chart');

/**
 * Load the partials
 */

var account = require('../partials/account');
var apps = require('../partials/apps');
var config = require('../partials/config');
var graphs = require('../partials/graphs');
var events = require('../partials/events');
var footer = require('../partials/footer');
var bandits = require('../partials/bandits');
var sidenav = require('../partials/sidenav');
var topnav = require('../partials/topnav');

/**
 * Configure the app
 */

app.config([
  '$routeProvider',
  '$locationProvider',

  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: apps
      })
      .when('/account', {
        templateUrl: account
      })
      .when('/apps/:app', {
        redirectTo: '/apps/:app/config'
      })
      .when('/apps/:app/config', {
        templateUrl: config,
        controller: HyperController,
        section: 'config'
      })
      .when('/apps/:app/graphs', {
        templateUrl: graphs,
        controller: HyperController,
        section: 'graphs'
      })
      .when('/apps/:app/events', {
        templateUrl: events,
        controller: HyperController,
        section: 'events'
      })
      .when('/apps/:app/bandits', {
        templateUrl: bandits,
        controller: HyperController,
        section: 'bandits'
      });
      // .otherwise({
      //   templateUrl: notFound,
      //   controller: IndexController
      // });

    $locationProvider.html5Mode(true);
  }
]);

/**
 * Listen for route changes
 */

app.run([
  '$rootScope',
  '$location',

  function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(currentRoute, conf) {
      $rootScope.section = conf.$$route.section;
    });
  }
]);
