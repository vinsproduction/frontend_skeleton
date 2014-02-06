
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

		if VK?

			VK.init =>

				### следить за изменениями хеша вконтакте ###
				VK.addCallback 'onLocationChanged', (location) ->
					console.debug '[VKONTAKTE > onLocationChanged]', location
					app.redirect location.replace("!","")

				### следить за скроллом ###
				VK.callMethod 'scrollSubscribe',true

				### событие после скролла ###
				VK.addCallback 'onScroll', (scroll, heigh) ->
					console.log '[VKONTAKTE > onScroll]', scroll, heigh

	### до перехода ###
	before: (route) ->

		if route isnt ''
			console.debug '[Route]',route

		if VK?
			### выставить хеш ###
			VK.callMethod('setLocation',route)

	
	### после перехода ###
	after: ->


	scrollTop: (speed=400) ->

		if speed
			$('html,body').animate({scrollTop: 0},speed)
			if VK? then VK.callMethod('scrollWindow', 0, speed)
		else
			$('body').scrollTop(0)
			if VK? then VK.callMethod('scrollWindow', 0)

	resize: (el) ->

		if VK?
			### ресайз окна Вконтакте ###
			window.onload = ->
				setTimeout(->
					diff 	= 530 # хардкодное число
					elH 	= $(el).height()
					h = elH + diff
					console.debug "[VKONTAKTE > resizeWindow] '#{el}' height:",h,'| elHeight:',elH, '| diff:',diff
					VK.callMethod "resizeWindow", 1000, h
				,1000)

	###  404 страница ###
	notFound: (path) ->

		el = $('section#notFound')

		@scrollTop()
		el.show()
		@resize(el)

	### Серверная ошибка ###
	ooops: ->

		el = $('section#notFound')

		@scrollTop()
		el.show()
		@resize(el)

	index: ->
		
		el = $('section#index')

		@scrollTop()
		el.show()
		@resize(el)

		#app.views['index'].controller()

	page: (id) ->

		el = $('section#page')

		@scrollTop()
		el.show()
		@resize(el)

		#app.views['index'].controller({id})

