
# Router

Backbone.Router::before = ->

Backbone.Router::after = ->

Backbone.Router::route = (route, name, callback) ->
	route = @_routeToRegExp(route)  unless _.isRegExp(route)
	if _.isFunction(name)
		callback = name
		name = ""
	callback = this[name]  unless callback
	router = this
	Backbone.history.route route, (fragment) ->
		args = router._extractParameters(route, fragment)
		router.before.apply router, arguments
		callback and callback.apply(router, args)
		router.after.apply router, arguments
		router.trigger.apply router, ["route:" + name].concat(args)
		router.trigger "route", name, args
		Backbone.history.trigger "route", router, name, args

class AppRouter extends Backbone.Router

	routes:

		"": "index"
		"!": "index"
		"!/": "index"

		"!/ooops" : "ooops"
		"!/ooops/" : "ooops"

		"*path" : "notFound"

	before: (route) ->
		if route isnt ''
			console.debug '[Route]',route

		$('body').scrollTop(0)

	after: ->

	
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'

	# 404 страница
	notFound: (path) ->
		$('section#notFound').show()

	# Серверная ошибка
	ooops: ->
		$('section#ooops').show()

	index: ->

		$('section#index').show()

		app.views['index'].controller()

