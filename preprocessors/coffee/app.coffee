### Front-end Skeleton / ver. 2.0 / 17.03.2014 ###

class App


	constructor: (options={}) ->

		@options = 

			## Имя проекта (опционально) ###
			name: 'Frontend Skeleton'

			### Хеш навигация в проекте ###
			hashNavigate: false

			### Удаленный хост для локальной разработки с api ###
			remoteHost: "http://vinsproduction.com"

			### Путь до картинок и прочей статики ###
			root: ""

			### Callback загрузки приложения ###
			onLoad: ->

		_.extend @options, options

		for k,v of @options
			@[k] = v

		### Дебаг режим ###
		@debugMode = /debug/.test(window.location.search)

		### Если хоста нет, значит - локальный просмотр! ###
		@local = window.location.host is "" or /localhost/.test window.location.host

		### HOST! ###
		@host = window.location.protocol + "//" + window.location.host


		### Возвращает параметры дебага, напр. ?debug=test -> вернет test ###
		@debug = do =>
			debug = $$.urlParam('debug')
			return if debug then debug.split(',') else []

		### Только для локальной разработки! ###
		if !$$.browser.msie and @local
			livereloadPort = 777 # Порт должен совпадать с портом в Gruntfile.js
			$$.includeJS "http://localhost:#{livereloadPort}/livereload.js"
			console.debug "[App > Livereload] http://localhost:#{livereloadPort}/livereload.js"

		### Если Ie! ###
		if $$.browser.msie6 or $$.browser.msie7 #or $$.browser.msie8

			#@redirect 'ie'
			return


		### Настройки библиотек ###
		do @libs

		### основная инизиализация ###
		do @init

	init: ->

		$ =>

			### Дебагер ###
			if 'box' in @debug then do @debugBox.init

			### Слушатели ###
			do @listeners

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

			console.debug "[App > onLoad]", @name, "Options >", @options, ' Debug >', @debug, ' Browser >', $$.browser.name

			do @onLoad


	listeners: ->

		self = @

		### Scroll ###

		### Listener callback scroll
		app.onScroll (v) ->
		###

		@onScroll = (callback) ->
			$(window).on 'AppOnScroll', (event,v) ->
				callback(v) if callback

		lastScrollTop = 0
		$(window).scroll (e) ->

			top = self.scroll()

			if top isnt lastScrollTop

				action = if top > lastScrollTop then 'down' else 'up'
				lastScrollTop = top

				if app.debugBox.state
					app.debugBox.log "scroll", "#{action} | top: #{top}px"

				vars = {top,action,e}

				$(window).trigger("AppOnScroll",[vars])

		$(window).scroll()

		### Resize ###

		### Listener callback resize
		app.onResize (v) ->
		###
		@onResize = (callback) ->
			$(window).on 'AppOnResize', (event,v) ->
				callback(v) if callback

		$(window).resize =>

			vars = app.size()

			if app.debugBox.state
				app.debugBox.log "sect", "header: #{vars.headerHeight}px | sections: #{vars.sectionsHeight}px | footer: #{vars.footerHeight}px"
				app.debugBox.log "res", "#{vars.windowWidth}px x #{vars.windowHeight}px"

			$(window).trigger("AppOnResize",[vars])

		$(window).resize()

	### Scroll

	app.scroll(500)
	app.scroll(500,true)
	app.scroll('section#guests',true)
	app.scroll('section#guests',{time:500,easing:'easeOutElastic',done:function(){console.log('animate complete');}})
	app.scroll($('section#guests'))

	###
	scroll: (v,animate) ->

		time 		= animate?.time 	|| 800
		easing 	= animate?.easing 	|| 'easeOutCubic'
		callback = false

		# Если это строка, то имеется ввиду селектор
		if v? and _.isString(v)

			el = $(v)

			if el[0] and _.isElement(el[0])

				if animate
					$('html,body').stop().animate {scrollTop : el.offset().top}, time, easing, ->
						if !callback
							callback = true 
							animate.done() if animate.done
				else
					$('html,body').scrollTop el.offset().top

		# Если это элемент дома
		else if v? and v[0] and _.isElement(v[0])

			if animate
				$('html,body').stop().animate {scrollTop : v.offset().top}, time, easing, ->
					if !callback
						callback = true 
						animate.done() if animate.done
			else
				$('html,body').scrollTop v.offset().top

		# Если передается значение
		else if v?

			if animate
				$('html,body').stop().animate {scrollTop :v}, time, easing, ->
					if !callback
						callback = true 
						animate.done() if animate.done
			else
				$('html,body').scrollTop v

		# В противном случае отдается значение
		else

			$(window).scrollTop()

	### Размеры ###
	size: ->

		vars = 

			windowWidth 	: $(window).width()
			windowHeight 	: $(window).height()

			documentWidth 	: $(document).width()
			documentHeight : $(document).height()

			bodyWidth 		: parseInt($('body').width())
			bodyHeight 		: parseInt($('body').height())

			mainWidth		: parseInt($('body > main').width())
			mainHeight		: parseInt($('body > main').height())

			headerWidth		: parseInt($('body > main > header').width())
			headerHeight	: parseInt($('body > main > header').height())

			footerWidth		: parseInt($('body > main > footer').width())
			footerHeight	: parseInt($('body > main > footer').height())
			
			sectionsWidth 	: parseInt($('body > main > .sections').width())
			sectionsHeight : parseInt($('body > main > .sections').height())


	### Hash навигация ###
	redirect: (page = "") ->
		console.debug '[App > redirect]', page

		if window.location.hash is "#!" + page
			@router.navigate("redirect")
		
		@router.navigate("!" + page,true)


	### @API
	Пример запроса: app.api.request 'user/details', 'GET', {}, (res) =>
		if res.error
				return app.errors.popup res.error
			else
				console.log res
	###

	### API pefix, например номер версии серверного api /api/v1/ ###
	apiPrefix: ""

	api: (url,type="GET",data={},callback) ->

		host = if @local then @remoteHost else @host

		url =  host + @apiPrefix + url

		$.ajax({ type, dataType:'json', url, data })

		.done( (res) =>

			response = if $$.browser.msie then JSON.stringify res else res

			if res.status is 'success'

				if !res.data then res.data = []

				console.debug "[App > api] #{url} | #{type}:", data, "| success: ", response

				callback res.data if callback

			else if res.status is 'error'

				console.error "[App > api] #{url} | #{type}:", data, "| error: ", response

				callback {error: res.error} if callback

		).fail( (res) =>

			response = if $$.browser.msie then JSON.stringify res else res

			console.error "[App > api] #{url} | #{type}:", data, "| fail: ", response

			if res.readyState is 4 and res.status is 404
				### запрос в никуда ###
				app.redirect "server-404" if @hashNavigate
			else
				### серверная ошибка ###
				app.redirect "server-error" if @hashNavigate
		)

	### Debug monitor ###
	debugBox:

		state: false

		init: ->

			@state = true

			$('body').append """
				<div id="debugBox" style="font-size: 14px;background:transparent;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#60000000,endColorstr=#60000000);background: rgba(0,0,0,0.6);position:fixed;z-index:10000; right:5px; bottom:5px;color:white; padding: 10px;">
					debug box
					<pre class="res">resolution: <span></span></pre>
					<pre class="scroll">scroll: <span>none</span></pre>
					<pre class="route">route: <span>none</span></pre>
					<div class="sect"></div>
					<div class="log"></div>
					<pre class="mediaHeight" style="color:red;"></pre>
					<pre class="mediaWidth" style="color:red;"></pre>
				</div>
			"""

		color:-> $('#debugBox').find(".log pre:nth-child(2n)").css({color: 'gray'})

		
		log: (place, log) ->

			switch place
				when 'log'
					$('#debugBox .log').append """
						<pre>#{log}</pre>
					"""
				when 'sect'
					$('#debugBox .sect').html """
						<pre>#{log}</pre>
					"""
				when 'res'
					$('#debugBox .res span').html """
						#{log}
					"""
				when 'scroll'
					$('#debugBox .scroll span').html """
						#{log}
					"""
				when 'route'
					$('#debugBox .route span').html """
						#{log}
					"""


			app.debugBox.color()

	### Всякие библиотеки для общего пользования ###
	libs: ->

		### Крайне важная штука для ajax запросов в рамках разных доменов, в IE!   ###
		$.support.cors = true
		$.ajaxSetup({ cache: false, crossDomain: true})

	### Социальные настройки ###
	social:

		vkontakteApiId		: ''
		facebookApiId		: '283793001782971'
		odnoklassnikiApiId: ''


		init: ->

			@url = if app.local then app.remoteHost else app.host

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
			it: -> 
				options = {}
				options.title 	= "title"
				options.description 	= "description"
				options.image 	= "#{app.host}/img/for_post.png"

				@facebook options

			vk: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://vkontakte.ru/share.php?"
				url += "url=" + encodeURIComponent(options.url)
				url += "&title=" + encodeURIComponent(options.title)
				url += "&description=" + encodeURIComponent(options.description)
				url += "&image=" + encodeURIComponent(options.image)
				url += "&noparse=true"

				@popup url

			vkCount: (url,callback) ->

				url = url || app.social.url

				VK = {Share: {}} if !VK
				VK.Share.count = (index, count) -> callback(count) if callback

				$.getJSON 'http://vkontakte.ru/share.php?act=count&index=1&url=' + url + '&format=json&callback=?'

			ok: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1"
				url += "&st.comments=" + encodeURIComponent(options.description)
				url += "&st._surl=" + encodeURIComponent(options.url)

				@popup url

			okCount: (url,callback) ->

				url = url || app.social.url

				ODKL = {} if !ODKL
				ODKL.updateCountOC = (a, count, b, c) -> callback(count) if callback

				$.getJSON 'http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&callback=?&ref='+url

			fb: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://www.facebook.com/sharer.php?s=100"
				url += "&p[title]=" + encodeURIComponent(options.title)
				url += "&p[summary]=" + encodeURIComponent(options.description)
				url += "&p[url]=" + encodeURIComponent(options.url)
				url += "&p[images][0]=" + encodeURIComponent(options.image)

				@popup url

			fbCount: (url,callback) ->

				url = url || app.social.url

				$.getJSON 'http://api.facebook.com/restserver.php?method=links.getStats&callback=?&urls=' + escape(url) + '&format=json', (data) ->
					callback(data[0].share_count) if callback

			tw: (options={}) ->

				options.url = options.url || app.social.url

				url = "http://twitter.com/share?"
				url += "text=" + encodeURIComponent(options.title)
				url += "&url=" + encodeURIComponent(options.url)
				url += "&counturl=" + encodeURIComponent(options.url)

				@popup url

			twCount: (url,callback) ->

				url = url || app.social.url

				$.getJSON 'http://urls.api.twitter.com/1/urls/count.json?url=' + url + '&callback=?', (data) ->
					callback(data.count) if callback

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
