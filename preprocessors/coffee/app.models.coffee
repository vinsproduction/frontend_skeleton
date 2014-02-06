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

class User extends PrototypeModel



### ============ Объявляем классы! =========== ###

class Models

	constructor: ->

		@user = new User