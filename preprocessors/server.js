

// node server

app = module.exports = function (port){

	var express = require('express')
	  , http = require('http')
	  , path = require('path');

	var app = express();

	app.set('port', process.env.PORT || port);
	app.set('views', __dirname );
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.static(path.join( '../')));

	//app.use(express.logger('dev'));
	app.use(express.errorHandler());


	app.all('/', function(req, res){
  		res.render('jade/index', { title: 'Express' });
  	});

	app.all('/tutorials', function(req, res){
  		res.render('jade/tutorials/index', { title: 'Express' });
  	});

	app.all('/upload', function(req, res){
  		res.json({ success: 'загрузилось на сервак' });
	});

	app.all('/remove', function(req, res){
  		res.json({ success: 'удалилось с сервака' });
	});

	http.createServer(app).listen(port, function(){
		console.log('\nSERVER listening on port ' + port + '\n');
	});


	return app;

}