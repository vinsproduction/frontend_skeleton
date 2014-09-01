
### Router ###

class indexHashRouter extends Backbone.Router

	### маршруты ###
	routes:

		"": "index"
		"!": "index"
		"!index": "index"

		"!page": "page"
		"!page/": "page"
		"!page/:id": "page"
		"!page/:id/": "page"

		"!ooops" : "ooops"
		"!ooops/" : "ooops"

		"*path" : "notFound"

	### инициализация ###
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'

	### до перехода ###
	before: (route) ->

		if route is ""
			@route = "empty"
		else
			@route = route

		app.debugBox.log("route",@route) if app.debugBox.state

		console.debug '[App > router]', 'route:', @route

		@hide()

	### после перехода ###
	after: (route) ->
		#console.debug '[App > router > after]'

	hide: ->

		$('body > main > .sections > section').removeClass('current').hide()

	show: ->

		@hide()
		@el.addClass('current').show()

	scrollTop: (speed) ->
		app.scroll(0,speed)
	
	###  404 страница ###
	notFound: (path) ->

		@el = $('section#notFound')

		@scrollTop()
		@show()

		console.error "[App > router] route #{path} not found"
		app.debugBox.log("route","not found") if app.debugBox.state

	### Серверная ошибка ###
	ooops: ->

		@el = $('section#ooops')

		@scrollTop()
		@show()
		
	index: ->

		@el = $('section[data-page="index"]')

		@scrollTop()
		@show()
		
		#app.views['index'].controller()

	page: (id) ->

		@el = $('section[data-page="page"]')

		@scrollTop()
		@show()
		
		#app.views['index'].controller({id})

class indexScrollRouter extends Backbone.Router

	### маршруты ###
	routes:

		"": "index"
		"!": "index"
		"!index": "index"

		"!page": "page"
		"!page/": "page"
		"!page/:id": "page"
		"!page/:id/": "page"

		"*path" : "notFound"

	### инициализация ###
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'

		setTimeout(=>

			sections = []

			app.views.all.section.each ->
				sections.push(name: $(@).attr('data-page'), top:$(@).position().top)
	
			sections.reverse()

			console.log '[App > View::indexScrollRouter > set sections]', sections

			app.onScroll (vars) =>
				find = _.find sections, (el) -> vars.top > el.top-10
				section = if find then find.name else 'none'
				@navigate '!' + section

		,700)

	### до перехода ###
	before: (route) ->

		if route is ""
			@route = "empty"
		else
			@route = route

		app.debugBox.log("route",@route) if app.debugBox.state

		console.debug '[App > router]', 'route:', @route

	### после перехода ###
	after: (route) ->
		#console.debug '[App > router > after]'

	show: ->
		app.scroll @el, true

	scrollTop: (speed) ->
		app.scroll(0,speed)
	
	###  404 страница ###
	notFound: (path) ->

		console.error "[App > router] route #{path} not found"
		app.debugBox.log("route","not found") if app.debugBox.state

		
	index: ->

		@el = $('section[data-page="index"]')

		@show()

	page: (id) ->

		@el = $('section[data-page="page"]')

		@show()
