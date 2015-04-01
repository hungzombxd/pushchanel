var pomelo = require('pomelo');
var httpPlugin = require('pomelo-http-plugin');
var path = require('path'); 
var routeUtil = require('./app/util/routeUtil');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'PushChannel');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.sioconnector,
      //websocket, htmlfile, xhr-polling, jsonp-polling, flashsocket
      transports : ['websocket'],
      heartbeats : true,
      closeTimeout : 60,
      heartbeatTimeout : 60,
      heartbeatInterval : 25
    });
});

app.configure('production|development', 'pushhttp', function() {
  app.loadConfig('httpConfig', path.join(app.getBase(), 'config/http.json'));
  app.use(httpPlugin, {
    http: app.get('httpConfig')[app.getServerId()]
  });
});

app.route('push', routeUtil.push);

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
