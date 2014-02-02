

// node server

app = module.exports = function (port){

	var express = require('express')
	  , routes = require('./routes')
	  , http = require('http')
	  , path = require('path');

	var app = express();

	app.set('port', process.env.PORT || port);
	app.set('views', __dirname );
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);

	app.use(express.static(path.join( '../')));

	app.use(express.logger('dev'));
	app.use(express.errorHandler());


	app.all('/', routes.index);
	app.all('/upload', routes.upload);
	app.all('/remove', routes.remove);

	return app;

}