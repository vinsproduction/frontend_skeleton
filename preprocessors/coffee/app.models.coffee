### Prototype Model ###

class PrototypeModel

	constructor: ->

	get: (url,data,callback)  -> app.api url, 'GET', data, (res) -> callback res

	post: (url,data,callback) -> app.api url, 'POST', data, (res) -> callback res


class UserModel extends PrototypeModel

	###
	Описание: Отдает данные пользователя
	###
	getDetails: (data,callback) ->

		@get 'api/user/details', data, (res) => callback res 
		
### ============ Объявляем классы! =========== ###

class Models

	constructor: ->

		@user = new UserModel