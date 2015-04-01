module.exports = function(app, http) {
	return new PushRoute(app, http);
};

var PushRoute = function(app, http) {
	this.app = app;
	this.http = http;
	var self = this;
	this.http.get('/push', function(req, res){
		self.push(req,res);
	});
	this.http.post('/push', function(req, res){
		self.push(req,res);
	});
};

PushRoute.prototype.push = function(req, res) {
	var self = this;
	console.log("body: " + JSON.stringify(req.body));
	var channel = req.param('channel', null);
    var msg = req.param('msg', null);
	self.app.rpc.push.pushRemote.push(null,channel,msg, function(){
		res.send('push success');
	});
};
