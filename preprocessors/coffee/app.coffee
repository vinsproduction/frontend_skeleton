class App

	constructor: ->

		# Имя проекта
		@name = 'project'
		
		# Если хоста нет, значит - локальный просмотр!
		@localhost = window.location.host is ""

		# Если localhost - проставляем настоящий хост
		@host = if @localhost then "http://#{@name}" else window.location.host

		# Путь до картинок и прочей статики
		# Для локалхоста показываем настоящие хочт
		@root	= if @localhost then @host else ""
	
		# Возвращает параметры дебага, напр. ?debug=test -> вернет test
		@debug = do =>
			debug = $$.urlParam('debug')
			return if debug then debug.split(',') else []

		# Только для локальной разработки!
		if !$$.browser.msie and @localhost
			livereloadPort = 35829
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

			# Классы - контроллеры/рендеры
			# @initViews()

			# Backbone Router
			# @router = new AppRouter
			# Backbone.history.start()

			# Настройки соцсетей
			do @social.init

			console.debug '[App::init] debug:',@debug, @

	# initViews: ->

	# 	@views =
	# 		articles: new new ArticlesView


	#redirect: (page = "") -> @router.navigate('!/' + page,true)

	libs: ->

		# Крайне важная штука для ajax запросов в рамках разных доменов, в IE!  
		jQuery.support.cors = true
		jQuery.ajaxSetup({ cache: false, crossDomain: true})


	social:

		defaults:
			vkontakteApiId		: '3819447'
			facebookApiId		: '228658570618080'
			odnoklassnikiApiId: '192750592'


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

				@popup options.url

			facebook: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.facebook.com/sharer.php?s=100"
				url += "&p[title]=" + encodeURIComponent(options.title)
				url += "&p[summary]=" + encodeURIComponent(options.text)
				url += "&p[url]=" + encodeURIComponent(options.url)
				url += "&p[images][0]=" + encodeURIComponent(options.img)

				@popup options.url

			twitter: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://twitter.com/share?"
				url += "text=" + encodeURIComponent(options.title)
				url += "&url=" + encodeURIComponent(options.url)
				url += "&counturl=" + encodeURIComponent(options.url)

				@popup options.url

			mailru: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://connect.mail.ru/share?"
				url += "url=" + encodeURIComponent(options.url)
				url += "&title=" + encodeURIComponent(options.title)
				url += "&description=" + encodeURIComponent(options.text)
				url += "&imageurl=" + encodeURIComponent(options.img)

				@popup options.url

			popup: (url) ->
				window.open url, "", "toolbar=0,status=0,width=626,height=436"


	erros:

		popup: (error) ->

			text = @getError(error) 
			customPopup 'Ошибка!', text, true
		
		get: (error) ->

			errors = @errors_ru()

			if $$.isObject(error)

				list 	= ""
				_.each error, (text) ->
					text = errors[text] or text
					list += text + "<br/><br/>"
			else

				list = errors[error]

			return list or "Неизвестная ошибка"

		ru: () ->

			"Error_1": "Первая ошибка"
