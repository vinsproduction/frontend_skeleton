
### Router ###

class Router extends Backbone.Router

	### маршруты ###
	routes:

		"": "index"
		"!": "index"
		"!/": "index"

		

		"!/popup": "popup"
		"!/popup/": "popup"

		"!/render": "render"
		"!/render/": "render"

		"!/CreativeButtons": "CreativeButtons"
		"!/CreativeButtons/": "CreativeButtons"
		"!/CreativeLinkEffects": "CreativeLinkEffects"
		"!/CreativeLinkEffects/": "CreativeLinkEffects"
		"!/IconHoverEffects": "IconHoverEffects"
		"!/IconHoverEffects/": "IconHoverEffects"

		"!/ooops" : "ooops"
		"!/ooops/" : "ooops"

		"*path" : "notFound"

	### инициализация ###
	initialize: ->

		@bind "all",  (route,router) ->
			#if route is 'route'

		# window.pageAnimate = false
		# app.onScroll (v) ->

		# 	if !window.pageAnimate

		# 		curentPage 	= $('body > main > .sections > section.current')
		# 		nextPage 	= curentPage.next('section')
		# 		prevPage 	= curentPage.prev('section')

		# 		if v.action is 'up'
		# 			#console.log 'scroll up'
		# 			if prevPage.size()
		# 				window.pageAnimate = true
		# 				app.redirect prevPage.attr('data-page')
		# 		else
		# 			#console.log 'scroll down'				
		# 			if nextPage.size()
		# 				window.pageAnimate = true
		# 				app.redirect nextPage.attr('data-page')

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
	after: ->

	hide: ->

		$('body > main > .sections > section[data-page]').removeClass('current').hide()

	show: ()  ->

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

		@el = $('section#notFound')

		@scrollTop()
		@show()

	index: ->
		
		@el = $('section#page-index')

		@scrollTop()
		@show()


		#app.views['index'].controller()

	"popup":  ->

		@el = $('section#page-popup')

		@scrollTop()
		@show()
	
		#app.views[''].controller({id})

	"render":  ->

		@el = $('section#page-render')

		@scrollTop()
		@show()
	
		#app.views[''].controller({id})

	"helpers-images":  ->

		@el = $('section#page-helpers-images')

		@scrollTop()
		@show()
	
		#app.views[''].controller({id})

	"CreativeButtons":  ->

		@el = $('section#page-CreativeButtons')

		@scrollTop()
		@show()
	
		#app.views[''].controller({id})

	"CreativeLinkEffects":  ->

		@el = $('section#page-CreativeLinkEffects')

		@scrollTop()
		@show()
	
		#app.views[''].controller({id})

	"IconHoverEffects":  ->

		@el = $('section#page-IconHoverEffects')

		@scrollTop()
		@show()
	
		#app.views[''].controller({id})

