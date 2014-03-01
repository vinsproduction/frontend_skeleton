
module.exports = function (app){

	app.all('/', function(req, res){
  		res.render('jade/index', { title: 'Express' });
  	});

	app.all('/test', function(req, res){

		data = { success: 'test success' }

		if(app.logData) console.log(data);
	  	res.json(data);
	});

};
