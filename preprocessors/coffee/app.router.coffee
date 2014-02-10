
### Router ###

class Router extends Backbone.Router

	### маршруты ###
	routes:

		"": "index"
		"!": "index"
		"!/": "index"

		"!/page/:id": "page"
		"!/page/:id/": "page"

		"!/ooops" : "ooops"
		"!/ooops/" : "ooops"

		"*path" : "notFound"

	### инициализация ###
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'


	### до перехода ###
	before: (route) ->

		if route isnt ''
			console.debug '[Route]',route

		@hide()

		if VK?
			### выставить хеш ###
			VK.callMethod('setLocation',route.replace("!",""))

	
	### после перехода ###
	after: (route) ->
		#console.debug '[Route > after]'


	hide: ->

		$('body > main > .sections section').removeClass('current').hide()

	show: (el)  ->

		el.addClass('current').show()


	scrollTop: (speed=400) ->

		if speed
			$('html,body').animate({scrollTop: 0},speed)
			if VK? then VK.callMethod('scrollWindow', 0, speed)
		else
			$('body').scrollTop(0)
			if VK? then VK.callMethod('scrollWindow', 0)


	###  404 страница ###
	notFound: (path) ->

		el = $('section#notFound')

		@scrollTop()
		@show(el)
		

	### Серверная ошибка ###
	ooops: ->

		el = $('section#notFound')

		@scrollTop()
		@show(el)
		

	index: ->

		# авто переход по переданному уру, на случай шаринга
		# if window.vkredirect and window.vkredirect not in ["","/"]
		# 	console.debug '[VKONTAKTE > hash detected!] Redirect to', window.vkredirect
		# 	app.redirect(window.vkredirect)
		# 	window.vkredirect = false
		# 	return
		
		el = $('section#index')

		@scrollTop()
		@show(el)
		

		#app.views['index'].controller()

	page: (id) ->

		el = $('section#page')

		@scrollTop()
		@show(el)
		

		#app.views['index'].controller({id})

