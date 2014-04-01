	
module.exports = function (app){

	app.all('/api/upload', function(req, res){

		data = { status: 'success', uploadfile: 'avatar_200_200.jpg' }

		if(app.logData) console.log(data);

	  	res.json(data);
	});

	app.all('/tutorials', function(req, res){
		res.render('jade/tutorials/index', { title: 'Express' });
	});

	app.all('/api/user/details', function(req, res){

		data = {
		    "data": {
			      "age": 31,
			      "avatar": "img/avatar_100_100.jpg",
			      "birthday": "1983-01-19",
			      "city": "Москва",
			      "country": "Россия",
			      "firstname": "Vins",
			      "gender": "male",
			      "uid": 131380871,
			      "lastname": "Surfer"
		    	},
		    "status": "success"
	  	}

		if(app.logData) console.log(data);
	  	res.json(data);

	});

	app.all('/api/getshop', function(req, res){

		var data = [
		
			{
				floor: -1,
				areas: [
					{id:9,name: 'Oysho'},
					{id:81,name: 'Спортмастер'}
				]
			},
			{
				floor: 1,
				areas: [
					{id:1,name: '1',type:1},

					{id:2,name: '2',type:2},
					{id:3,name: '3',type:3},
					{id:4,name: '4',type:4},
					{id:5,name: '5',type:5},
					{id:6,name: '6',type:6},
					{id:7,name: '7',type:7},
					{id:8,name: '8',type:8},
					{id:9,name: '9',type:9},
					{id:10,name: '10',type:10},
					{id:11,name: '11',type:11},
					{id:12,name: '12',type:12},

					{id:13,name: '13',type:13},
					{id:14,name: '14',type:14},
					{id:15,name: '15',logo:'logo.png', type:15,sale:true, url: '/ru/shops/182'},
					{id:16,name: '16',type:16},
					{id:17,name: '17',type:17},
					{id:18,name: '18',type:18},
					{id:19,name: '19',type:19},
					{id:20,name: '20',type:20},
					{id:21,name: '21',type:21},
					{id:22,name: '22',type:22},
					{id:23,name: '23',type:23},
					{id:24,name: '24',type:24},


				]
			},
			{
				floor: 2,
				areas: [
					{id:51,name: 'HAPPYLON'},
					{id:102,name: 'Эльдарадо'}
				]
			},
			{
				floor: 3,
				areas: [
					{id:51,name: 'HAPPYLON'},
					{id:102,name: 'Эльдарадо'}
				]
			},	
		];

		if(app.logData) console.log(data);
		res.json(data);

	});

};