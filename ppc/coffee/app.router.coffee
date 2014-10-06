
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

	show: (pageName,pageKey="") ->

		el = $("section[data-page='#{pageName}']")

		@hide() 
		el.addClass('current').show()
		$('body')
			.attr('data-page',pageName)
			.attr('data-key',pageKey)

	scrollTop: (speed) ->
		app.scroll(0,speed)
	
	###  404 страница ###
	notFound: (path) ->

		pageName = 'not-found'

		@scrollTop()
		@show(pageName)

		console.error "[App > router] route #{path} not found"
		app.debugBox.log("route","not found") if app.debugBox.state

	### Серверная ошибка ###
	ooops: ->

		pageName = 'ooops'

		@scrollTop()
		@show(pageName)
		
	index: ->

		pageName = "index"

		@scrollTop()
		@show(pageName)

		#app.views[pageName].controller()
		
	page: (id) ->

		pageName = "page"

		@scrollTop()
		@show(pageName)

		#app.views['page'].controller({id})

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
				# 60 - отступ всех секций
				sections.push(name: $(@).attr('data-page'), top: $(@).offset().top - 60)
	
			sections.reverse()

			console.log '[App > indexScrollRouter > set sections]', sections

			app.onScroll (vars) =>
				find = _.find sections, (el) -> vars.top > el.top-10
				section = if find then find.name else false
				if section
					@navigate '!' + section
					@show(section,false)

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

	hide: ->

		$('body > main > .sections > section').removeClass('current')

	show: (pageName,scroll=true) ->

		el = $("section[data-page='#{pageName}']")

		@hide() 
		el.addClass('current')

		$('body').attr('data-page',pageName)

		# 60 - отступ всех секций
		app.scroll(el.offset().top - 60, true) if scroll

	scrollTop: (speed) ->
		app.scroll(0,speed)
	
	###  404 страница ###
	notFound: (path) ->

		console.error "[App > router] route #{path} not found"
		app.debugBox.log("route","not found") if app.debugBox.state

		
	index: ->

		pageName = "index"

		@show(pageName)

	page: (id) ->

		pageName = "page"

		@show(pageName)
