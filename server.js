var config = require('./config.json');

var connect = require('connect');
var http = require('http');
var clc = require('cli-color');
var proxy = require('proxy-middleware');
var url = require('url');

//var serveStatic = require('serve-static');

var fronton = connect();

config.apps.forEach(function(appConf) {
	var detailedConf = require(appConf.path + '/fronton.json');
	var app = connect();

	var urlParts = url.parse('http://localhost:1337/');

	app.use(proxy(urlParts));

	fronton.use(connect.vhost(appConf.domain, app));
});

//app.use(serveStatic('public/ftp', {'index': 'default.html'}));
// app.listen();


// connect()
//   .use(connect.vhost('foo.com', fooApp))
//   .use(connect.vhost('bar.com', barApp))
//   .use(connect.vhost('*.com', mainApp))

var server = http.createServer(fronton);

server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
  	console.log(clc.red('ERROR: ') + 'Can`t start Fronton on port '+ config.port + '. This port is already in use.');
  } else if (e.code == 'EACCES') {
    console.log(
    	clc.red('ERROR: ') + 'Can`t start Fronton on port '+ config.port +
    	'. User has no access to this port. Try running Fronton using sudo command.'
    );
  } else {
  	console.log(clc.red('ERROR: '), e);
  }

});

server.listen(config.port, function() {
	console.log(clc.green('Fronton is listening on port ' + config.port));
});
