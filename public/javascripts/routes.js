/**
 * Expose the app routes
 */

module.exports = {
  '/': 'apps',
  '/account': 'account',
  '/apps/:app': {redirectTo: '/apps/:app/config'},
  '/apps/:app/config': 'config',
  '/apps/:app/graphs': 'graphs',
  '/apps/:app/events': 'events',
  '/apps/:app/bandits': 'bandits'
};
