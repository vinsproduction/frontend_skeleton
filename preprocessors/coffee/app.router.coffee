
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

		"!/profile": "profile"
		"!/profile/": "profile"
		"!/profile/:uid": "profile"
		"!/profile/:uid/": "profile"

		"!/profile/:uid/:action": "profile"
		"!/profile/:uid/:action/": "profile"
		"!/profile/:uid/:action/:sid": "profile"
		"!/profile/:uid/:action/:sid/": "profile"

		"!/story/:id": "storyView"
		"!/story/:id/": "storyView"

		"!/ooops" : "ooops"
		"!/ooops/" : "ooops"

		"!/ie" : "ie"
		"!/ie/" : "ie"

		"*path" : "notFound"

	before: (route) ->

		console.debug '[Route]',route

		$('body').scrollTop(0)

		$('section').hide()
		$("section#menu a").removeClass 'active'

	after: ->

	
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'

	changeBg: (className="") ->

		$('.background')
			.removeClass('bg-1')
			.removeClass('bg-2')
			.removeClass('bg-3')

		$('.background').addClass(className) if className isnt ""

	
	notFound: (path) ->

		if path is '_=_'
			app.redirect()
			return

		$('section#notFound').show()
	
		@changeBg 'bg-1'

	ooops: ->

		$("section").hide()
		$('section#ooops').show()

		@changeBg 'bg-1'

	ie: ->

		$("section").hide()
		$('section#ie').show()

		@changeBg 'bg-1'

	index: ->

		$("section").hide()
		$('section#articles').show()

		@changeBg()

		app.views.articles.controller()
