### Prototype Model ###

class PrototypeModel

	constructor: ->

	get: (url,data,callback)  ->app.api {url, dataType:'GET', data, dataType: 'json', callback: (res) -> callback res}

	post: (url,data,callback) -> app.api {url, dataType:'POST', data, dataType: 'json', callback: (res) -> callback res}


class UserModel extends PrototypeModel

	###
	Описание: Отдает данные пользователя
	###
	getDetails: (data,callback) ->

		@get 'api/user/details', data, (res) =>
			if res.status is 'success'
				callback res.data





### ============ Объявляем классы! =========== ###

class Models

	constructor: ->

		@user = new UserModel