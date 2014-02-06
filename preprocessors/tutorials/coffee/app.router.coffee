
### Router ###

class Router extends Backbone.Router

	### маршруты ###
	routes:

		"": "index"
		"!": "index"
		"!/": "index"

		"!/helpers-images": "helpers-images"
		"!/helpers-images/": "helpers-images"

		"!/popup": "popup"
		"!/popup/": "popup"

		"!/render": "render"
		"!/render/": "render"

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

		$('section').hide()

	### после перехода ###
	after: ->

	scrollTop: (speed=400) ->

		if speed
			$('html,body').animate({scrollTop: 0},speed)
		else
			$('body').scrollTop(0)

	resize: (el) ->

	###  404 страница ###
	notFound: (path) ->

		el = $('section#notFound')

		@scrollTop()
		el.show()

	### Серверная ошибка ###
	ooops: ->

		el = $('section#notFound')

		@scrollTop()
		el.show()

	index: ->
		
		el = $('section#index')

		@scrollTop()
		el.show()


		#app.views['index'].controller()

	"popup":  ->

		el = $('section#page-popup')

		@scrollTop()
		el.show()
	
		#app.views[''].controller({id})

	"render":  ->

		el = $('section#page-render')

		@scrollTop()
		el.show()
	
		#app.views[''].controller({id})

	"helpers-images":  ->

		el = $('section#page-helpers-images')

		@scrollTop()
		el.show()
	
		#app.views[''].controller({id})

