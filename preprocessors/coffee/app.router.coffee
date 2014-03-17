
### Router ###

class Router extends Backbone.Router

	### маршруты ###
	routes:

		"": "index"
		"/": "index"

		"page/:id": "page"
		"page/:id/": "page"

		"ooops" : "ooops"
		"ooops/" : "ooops"

		"*path" : "notFound"

	### инициализация ###
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'


	### до перехода ###
	before: (route) ->

		@route = if route is "" then "empty" else route

		app.debugBox.log 'route:' + @route

		console.debug '[Route]', @route

		@hide()


	### после перехода ###
	after: (route) ->

		#console.debug '[Route > after]'

	hide: ->

		$('body > main > .sections > section').removeClass('current').hide()

	show: (el)  ->

		@hide()

		el.addClass('current').show()


	scrollTop: (speed=400) ->

		if speed
			$('html,body').animate({scrollTop: 0},speed)
		else
			$('body').scrollTop(0)
	

	###  404 страница ###
	notFound: (path) ->

		el = $('section#notFound')

		@scrollTop()
		@show(el)
		

	### Серверная ошибка ###
	ooops: ->

		el = $('section#ooops')

		@scrollTop()
		@show(el)
		

	index: ->

		el = $('section#index')

		@scrollTop()
		@show(el)
		

		#app.views['index'].controller()

	page: (id) ->

		el = $('section#page')

		@scrollTop()
		@show(el)
		

		#app.views['index'].controller({id})

