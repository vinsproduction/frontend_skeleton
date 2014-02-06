### Prototype Model ###

class PrototypeModel

	constructor: ->

		# включить рыбу!
		@fish = window.location.host is "" or /localhost/.test window.location.host
		#@fish = false

	# Эмуляция данных сервера
	getFish: (url,data,res,callback) ->

		# Такая галиматья нужна чтобы избавиться от ссылки на объект!
		# С сервера же будет сразу нормальный json приходить

		json 	= JSON.stringify res
		obj 	= $.parseJSON json

		response = obj.data || []

		console.warn '[WARNING Api FISH!]', url, '| request:',data, '| response:', response

		callback response

### Models ###

class UserModel extends PrototypeModel

	# Ответ с серевера
	getRes:
		{
		  "data": {
		    "age": 31,
		    "avatar": "http://cs607518.vk.me/v607518871/1b51/MLpE9yqMzOg.jpg",
		    "birthday": "1983-01-19",
		    "city": "Москва",
		    "country": "Россия",
		    "firstname": "Vins",
		    "gender": "male",
		    "uid": 131380871,
		    "lastname": "Surfer",
		    
		  },
		  "status": "success"
		}

	###
	Описание: Отдает данные пользователя
	###
	get: (data,callback) ->

		url = 'user/details'

		return @getFish url,data,@getRes,callback if @fish

		app.api url, 'GET', data, (res) => callback res






### ============ Объявляем классы! =========== ###

class Models

	constructor: ->

		@user = new UserModel