class App

	ver: '3.0'

	## Имя проекта ###
	name: 'Frontend Skeleton'

	### Хеш навигация в проекте ###
	hashNavigate: false

	constructor: ->

		### Если хоста нет, значит - локальный просмотр! ###
		@localhost = window.location.host is "" or /localhost/.test window.location.host

		### Если localhost - проставляем настоящий хост ###
		@host = if @localhost then "http://vinsproduction.com" else "http://" + window.location.host

		### Путь до картинок и прочей статики ###
		@root = ""
	
		### Возвращает параметры дебага, напр. ?debug=test -> вернет test ###
		@debug = do =>
			debug = $$.urlParam('debug')
			return if debug then debug.split(',') else []

		### Только для локальной разработки! ###
		if !$$.browser.msie and @localhost
			livereloadPort = 777 # Порт должен совпадать с портом в Gruntfile.js
			$$.includeJS "http://localhost:#{livereloadPort}/livereload.js"
			console.debug "[Livereload] http://localhost:#{livereloadPort}/livereload.js"

		### Если Ie! ###
		if $$.browser.msie6 or $$.browser.msie7 #or $$.browser.msie8

			#@redirect 'ie'
			return

		### Настройки библиотек ###
		do @libs


	### основная инизиализация ###

	init: ->

		$ =>

			### Дебагер ###
			if 'box' in @debug then do @debugBox.init

			### модели/api ###
			if Models
				@models 	= new Models

			### контроллеры/рендеры ###
			if Views
				@views 	= new Views

			### Роутер/хеш навигация ###
			if @hashNavigate
				@router = new Router
				Backbone.history.start()

			### Настройки соцсетей ###
			do @social.init

			console.debug '[App::init] debug:',@debug, @

	### Hash навигация ###
	redirect: (page = "") ->
		console.debug '[app > redirect]', page

		if window.location.hash is "#!" + page
			@router.navigate("!/redirect")
		
		@router.navigate("!" + page,true)


	### @API
	Пример запроса: app.api.request 'user/details', 'GET', {}, (res) =>
		if res.error
				return app.errors.popup res.error
			else
				console.log res
	###

	### API pefix, например номер версии серверного api /api/v1/ ###
	api_prefix: ""

	api: (url,type="GET",data={},callback) ->

		url =  app.host + @api_prefix + url

		$.ajax({ type, url, data })

		.done( (res) =>

			response = if $$.browser.msie then JSON.stringify res else res

			if res.status is 'success'

				if !res.data then res.data = []

				console.debug "[Api] #{url} | #{type}:", data, "| success: ", response

				callback res.data if callback

			else if res.status is 'error'

				console.error "[Api] #{url} | #{type}:", data, "| error: ", response

				callback {error: res.error} if callback

		).fail( (res) =>

			response = if $$.browser.msie then JSON.stringify res else res

			console.error "[Api] #{url} | #{type}:", data, "| fail: ", response

			if res.readyState is 4 and res.status is 404
				### запрос в никуда ###
				app.redirect '/404' if @hashNavigate
			else
				### серверная ошибка ###
				app.redirect '/ooops' if @hashNavigate
		)

	### Debug monitor ###
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

	### Всякие библиотеки для общего пользования ###
	libs: ->

		### Крайне важная штука для ajax запросов в рамках разных доменов, в IE!   ###
		jQuery.support.cors = true
		jQuery.ajaxSetup({ cache: false, crossDomain: true})

	### Социальные настройки ###
	social:

		url: ""

		vkontakteApiId		: ''
		facebookApiId		: ''
		odnoklassnikiApiId: ''


		init: ->

			app.social.url = @host

			# if VK?
			# 	VK.init
			# 		apiId: app.social.vkontakteApiId

			# if FB?
			# 	FB.init
			# 		appId: app.social.facebookApiId
			# 		status: true
			# 		cookie: true
			# 		xfbml: true
			# 		oauth: true

		
		### Пост на стенку в соц. сети ###
		wallPost:

			vkontakte: (options={}) ->


				if !VK? then return console.warn '[App > social > wallPost] VK is not defined'

				###
				в attachments должна быть только 1 ссылка! Если надо прекрепить фото, 
				оно должно быть залито в сам ВКонтакте
				###

				options.attachLink = if options.attachLink then "#{app.social.url}#" + options.attachLink else app.social.url
				options.attachPhoto = if options.attachPhoto then options.attachPhoto else "photo131380871_321439116"

				VK.api "wall.post",
					owner_id	: options.owner_id
					message	: options.message
					attachments: "#{options.attachPhoto},#{options.attachLink}"

						
				, (r) ->

					# ответ после отправки приходит в любом случае, даже если закрыли попап!

					if not r or r.error
						console.error '[VKONTAKTE > wall.post]', r
						if options.error
							options.error(r.error)

						if popup and r.error and r.error.error_msg and r.error.error_code
							if r.error.error_code is 214
								app.errors.popup "Стенка закрыта", false
					else
						console.debug '[VKONTAKTE > wall.post] success'
						if options.success then options.success()

					if options.allways then options.allways()

			facebook: (options={}) ->

				if !FB? then return console.warn '[FB > social > wallPost] FB is not defined'

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

		### Шаринг в сосетях ###
		share:

			### 
			просто хелпер для всего приложения для навешивания на ссылки, например:
			app.social.share.it()
			###
			itVk: -> 
				options = {}
				options.title 	= "title"
				options.description 	= "description"
				options.url 	= app.social.url
				options.image 	= "#{app.host}/img/for_post.png"

			vkontakte: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://vkontakte.ru/share.php?"
				url += "url=" + encodeURIComponent(options.url)
				url += "&title=" + encodeURIComponent(options.title)
				url += "&description=" + encodeURIComponent(options.description)
				url += "&image=" + encodeURIComponent(options.image)
				url += "&noparse=true"

				@popup url

			odnoklassniki: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1"
				url += "&st.comments=" + encodeURIComponent(options.description)
				url += "&st._surl=" + encodeURIComponent(options.url)

				@popup url

			facebook: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.facebook.com/sharer.php?s=100"
				url += "&p[title]=" + encodeURIComponent(options.title)
				url += "&p[summary]=" + encodeURIComponent(options.description)
				url += "&p[url]=" + encodeURIComponent(options.url)
				url += "&p[images][0]=" + encodeURIComponent(options.image)

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
				url += "&description=" + encodeURIComponent(options.description)
				url += "&imageurl=" + encodeURIComponent(options.image)

				@popup url

			popup: (url) ->
				window.open url, "", "toolbar=0,status=0,width=626,height=436"

	# Примеры вызова ошибок из вьюх, с русификатором
	# app.errors.get res.error
	# app.errors.popup res.error

	errors:

		popup: (error,ru=true) ->

			text = if ru then @get(error) else error
			popup.custom 'Ошибка!', text
		
		get: (error) ->

			if $$.isObject(error)

				list 	= ""
				_.each error, (text) =>
					text = @rus[text] or text
					list += text + "<br/><br/>"
			else

				list = @rus[error]

			return list or "Неизвестная ошибка"

		### Русификатор ###
		rus: 

			"Story doesn't exist": "Истории не существует"
			"User is not authenticated": "Юзер не авторизован"
