module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.status = function(msg, session, next) {
  next(null, {code: 200, msg: 'push server is ok.'});
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var self = this;
	var clientId = msg.clientId;
	var channelName = msg.channelName;
	//duplicate log in
	var sessionService = self.app.get('sessionService');
	if( !! sessionService.getByUid(clientId)) {
		next(null, {
			route: 'subscribe',
			result: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
		});
		return;
	}

	session.set('channel', channelName);
	session.push('channel', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	console.log("bind with clientId: " + clientId);
	session.bind(clientId);
	session.on('closed', unsubscribe.bind(null, self.app));
	self.app.rpc.push.pushRemote.subscribe(session,self.app.get('serverId'), channelName, clientId, function(){
		var result = {
			route: 'subscribe',
			result: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
		};
	    next(null, result);
	});
};

var unsubscribe = function(app, session) {
	console.log('unsubscribe: ' + session.uid);
	if(!session || !session.uid) {
		return;
	}
	app.rpc.push.pushRemote.kick(session, session.uid, app.get('serverId'), session.get('channel'), null);
};
