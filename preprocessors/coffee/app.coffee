class App

	constructor: (options={}) ->

		# Имя проекта
		@name = 'Frontend Skeleton'
		
		# Если хоста нет, значит - локальный просмотр!
		@localhost = window.location.host is "" or /localhost/.test window.location.host

		# Если localhost - проставляем настоящий хост
		@host = if @localhost then "http://vinsproduction.com" else "http://" + window.location.host

		# Путь до картинок и прочей статики
		@root = options.root || ""
	
		# Возвращает параметры дебага, напр. ?debug=test -> вернет test
		@debug = do =>
			debug = $$.urlParam('debug')
			return if debug then debug.split(',') else []

		# Только для локальной разработки!
		if !$$.browser.msie and @localhost
			livereloadPort = 777 # Порт должен совпадать с портом в Gruntfile.js
			$$.includeJS "http://localhost:#{livereloadPort}/livereload.js"
			console.debug "[Livereload] http://localhost:#{livereloadPort}/livereload.js"

		# Если Ie пшелнах!
		if $$.browser.msie6 or $$.browser.msie7 #or $$.browser.msie8

			#@redirect 'ie'
			return

		# Настройки библиотек
		do @libs


	# основная инизиализация

	init: ->

		$ =>

			# Дебагер
			if 'box' in @debug then do @debugBox.init

			# Классы - модели/api
			@models 	= new Models

			# Классы - контроллеры/рендеры
			@views 	= new Views

			# Backbone Router
			@router = new AppRouter
			Backbone.history.start()

			# Настройки соцсетей
			do @social.init

			console.debug '[App::init] debug:',@debug, @


	redirect: (page = "") -> @router.navigate("!" + page,true)


	### @API
	Пример запроса: app.api.request 'user/details', 'GET', {}, (res) =>
		if res.error
				return app.errors.popup res.error
			else
				console.log res
	###

	api: (url,type="GET",data={},callback) ->

		prefix = '/api/v1/'

		url =  app.host + prefix + url

		$.ajax({ type, url, data })

		.done( (res) ->

			response = if $$.browser.msie then JSON.stringify res else res

			if res.status is 'success'

				if !res.data then res.data = []

				console.debug "[Api] #{url} | #{type}:", data, "| success: ", response

				callback res.data if callback

			else if res.status is 'error'

				console.error "[Api] #{url} | #{type}:", data, "| error: ", response

				callback {error: res.error} if callback

		).fail( (res) ->

			response = if $$.browser.msie then JSON.stringify res else res

			console.error "[Api] #{url} | #{type}:", data, "| fail: ", response

			if res.readyState is 4 and res.status is 404
				app.redirect '/404'
			else
				app.redirect '/ooops'
		)

	debugBox:

		init: ->

			$('body').append """
				<div id="debugBox" style="font-size: 14px;background: rgba(0,0,0,0.6);position:fixed;z-index:10000; right:5px; bottom:5px;color:white; padding: 10px;">
					debug box
					<pre class="res">resolution: <span></span></pre>
					<div class="sect"></div>
					<div class="log"></div>
					<pre class="mediaHeight" style="color:red;"></pre>
					<pre class="mediaWidth" style="color:red;"></pre>
				</div>
			"""

		color:-> $('#debugBox').find(".log pre:nth-child(2n)").css({color: 'gray'})

		
		log: (place, log) ->

			if place is 'log'

				$('#debugBox .log').append """
					<pre>#{log}</pre>
				"""
			else if place is 'sect'

				$('#debugBox .sect').html """
					<pre>#{log}</pre>
				"""
			else if place is 'res'
				$('#debugBox .res span').html """
					#{log}
				"""

			app.debugBox.color()

	libs: ->

		# Крайне важная штука для ajax запросов в рамках разных доменов, в IE!  
		jQuery.support.cors = true
		jQuery.ajaxSetup({ cache: false, crossDomain: true})

	social:

		defaults:
			vkontakteApiId		: ''
			facebookApiId		: ''
			odnoklassnikiApiId: ''


		init: ->

			_init = ->

				app.social.url = @host

				if VK
					VK.init
						apiId: app.social.vkontakteApiId

				if FB
					FB.init
						appId: app.social.facebookApiId
						status: true
						cookie: true
						xfbml: true
						oauth: true

		wallPost:

			vkontakte: (options={}) ->

				VK.api "wall.post",
					owner_id	: options.owner_id
					message	: options.message
				, (r) ->

					if not r or r.error
						console.error '[socWallPost Vkontakte] error', r
						if options.error then options.error()
					else
						console.debug '[socWallPost Vkontakte] success'
						if options.success then options.success()

					if options.allways then options.allways()



			facebook: (options={}) ->

				FB.ui
					to: options.to
					method: "feed"
					link: options.link || app.social.url
					picture: options.picture  || ""
					name: options.name  || ""
					description: options.description || ""
					caption: options.caption || ""
				, (r) ->

					unless r
						console.error '[socWallPost Facebook] error', r
						if options.error then options.error()
					else
						console.debug '[socWallPost Facebook] success'
						if options.success then options.success()

					if options.allways then options.allways()

					

			odnoklassniki: (options={}) ->
				url = options.url || app.social.url

				window.open "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + encodeURIComponent(url) + "&st.comments=" + encodeURIComponent(options.comments), "", "toolbar=0,status=0,width=626,height=436"

		share:

			vkontakte: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://vkontakte.ru/share.php?"
				url += "url=" + encodeURIComponent(options.url)
				url += "&title=" + encodeURIComponent(options.title)
				url += "&description=" + encodeURIComponent(options.text)
				url += "&image=" + encodeURIComponent(options.img)
				url += "&noparse=true"

				@popup url

			odnoklassniki: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1"
				url += "&st.comments=" + encodeURIComponent(options.text)
				url += "&st._surl=" + encodeURIComponent(options.url)

				@popup url

			facebook: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.facebook.com/sharer.php?s=100"
				url += "&p[title]=" + encodeURIComponent(options.title)
				url += "&p[summary]=" + encodeURIComponent(options.text)
				url += "&p[url]=" + encodeURIComponent(options.url)
				url += "&p[images][0]=" + encodeURIComponent(options.img)

				@popup url

			twitter: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://twitter.com/share?"
				url += "text=" + encodeURIComponent(options.title)
				url += "&url=" + encodeURIComponent(options.url)
				url += "&counturl=" + encodeURIComponent(options.url)

				@popup url

			mailru: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://connect.mail.ru/share?"
				url += "url=" + encodeURIComponent(options.url)
				url += "&title=" + encodeURIComponent(options.title)
				url += "&description=" + encodeURIComponent(options.text)
				url += "&imageurl=" + encodeURIComponent(options.img)

				@popup url

			popup: (url) ->
				window.open url, "", "toolbar=0,status=0,width=626,height=436"

	
	# Примеры вызова ошибок из вьюх
	# app.errors.get res.error
	# app.errors.popup res.error

	errors:

		popup: (error) ->

			text = @get(error) 
			customPopup 'Ошибка!', text, true
		
		get: (error) ->

			if $$.isObject(error)

				list 	= ""
				_.each error, (text) =>
					text = @rus[text] or text
					list += text + "<br/><br/>"
			else

				list = @rus[error]

			return list or "Неизвестная ошибка"

		rus: 

			"Story doesn't exist": "Истории не существует"
			"User is not authenticated": "Юзер не авторизован"
