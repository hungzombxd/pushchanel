module.exports = function(app) {
	return new PushRemote(app);
};

var PushRemote = function(app) {
	this.app = app;
	this.channelService = app.get('channelService');
};

PushRemote.prototype.subscribe = function(sid,channelName,clientId,cb) {
	var channel = this.channelService.getChannel(channelName, true);
	if( !! channel) {
		channel.add(clientId, sid);
	}
	cb();
};

PushRemote.prototype.push = function(channel, message,cb) {
	console.log('push to channel: ' + channel + ' message: ' + message);
	var channel = this.channelService.getChannel(channel, true);
	var param = {
		route: 'onMessage',
		msg: message
	};
	channel.pushMessage(param);
	cb();
};

PushRemote.prototype.kick = function(uid,sid,channelName,cb) {
	var channel = this.channelService.getChannel(channelName, false);
	if( !! channel) {
		var member = channel.getMember(uid);
		if(!!member) {
			channel.leave(uid, sid);
			console.log("uid: " + uid + " leave channel " + channelName);
		}
	}
	cb();
};