var envs = require('envs')
var hyperagent = require('hyperagent')

envs.set(window.env);



Polymer('p-apps-list', {
  ready: function () {
    var self = this;
    hyperagent()
      .end(function (res) {
        res
          .follow('apps')
          .end(function (res) {
            self.apps = res.body.apps;
          });
      })
  },
})
