class App

	constructor: ->

		# Настоящие константы проекта!
		@name = 'TPS'
		@host = "http://#{@name}"

		# Если хоста нет, значит - локальный просмотр!
		@localhost = window.location.host is ""

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
			console.debug "[Livereload::init] port #{livereloadPort}"

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

				app.social.url = if app.localhost then @host else "http://" + window.location.host

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
				window.open "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + encodeURIComponent(url) + "&st.comments=" + encodeURIComponent(options.comments), "", "width=600,height=380"

		share:

			vkontakte: (purl, ptitle, pimg, text) ->
				url = "http://vkontakte.ru/share.php?"
				url += "url=" + encodeURIComponent(purl)
				url += "&title=" + encodeURIComponent(ptitle)
				url += "&description=" + encodeURIComponent(text)
				url += "&image=" + encodeURIComponent(pimg)
				url += "&noparse=true"
				@popup url

			odnoklassniki: (purl, text) ->
				url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1"
				url += "&st.comments=" + encodeURIComponent(text)
				url += "&st._surl=" + encodeURIComponent(purl)
				@popup url

			facebook: (purl, ptitle, pimg, text) ->
				url = "http://www.facebook.com/sharer.php?s=100"
				url += "&p[title]=" + encodeURIComponent(ptitle)
				url += "&p[summary]=" + encodeURIComponent(text)
				url += "&p[url]=" + encodeURIComponent(purl)
				url += "&p[images][0]=" + encodeURIComponent(pimg)
				@popup url

			twitter: (purl, ptitle) ->
				url = "http://twitter.com/share?"
				url += "text=" + encodeURIComponent(ptitle)
				url += "&url=" + encodeURIComponent(purl)
				url += "&counturl=" + encodeURIComponent(purl)
				@popup url

			mailru: (purl, ptitle, pimg, text) ->
				url = "http://connect.mail.ru/share?"
				url += "url=" + encodeURIComponent(purl)
				url += "&title=" + encodeURIComponent(ptitle)
				url += "&description=" + encodeURIComponent(text)
				url += "&imageurl=" + encodeURIComponent(pimg)
				@popup url

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
