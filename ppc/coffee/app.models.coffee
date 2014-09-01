### Prototype Model ###

class PrototypeModel

	constructor: ->

	getApiPrefix: ->

		return "api/"

	get: (url,data={},callback)  ->

		app.api.get @getApiPrefix() + url, data, (res) ->

			if res.status is "error"
				console.error("[App > models] #{url} | error: ", res.message)

			callback(res) if callback

	post: (url,data={},callback) ->

		app.api.post @getApiPrefix() + url, data, (res) ->

				if res.status is "error"
					console.error("[App > models] #{url} | error: ", res.message)

				callback(res) if callback

class UserModel extends PrototypeModel

	###
	Описание: Отдает данные пользователя
	###
	getDetails: (data,callback) ->

		@get 'user/details', data, (res) => callback res 
		
### ============ Объявляем классы! =========== ###

class Models

	constructor: ->

		@user = new UserModel