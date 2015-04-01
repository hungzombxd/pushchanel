var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.push = function(session,msg, app, cb) {
	var pushServers = app.getServersByType('push');
	if(!pushServers || pushServers.length === 0) {
		cb(new Error('can not find push servers.'));
		return;
	}

	var res = dispatcher.dispatch("push", pushServers);

	cb(null, res.id);
};