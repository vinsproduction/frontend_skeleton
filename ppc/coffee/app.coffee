### 
	Front-end Skeleton
	http://github.com/vinsproduction/frontend_skeleton
###

class App


	constructor: (options={}) ->

		@options = 

			## Имя проекта (опционально) ###
			name: 'Frontend Skeleton'

			### Дебаг префикс в урле ###
			debugUri: "debug"

			### Визуальный дебаг префикс в урле ###
			boxUri: "box"

			### Локальный хост ###
			localHost: ["","localhost"]

			### Удаленный хост для локальной разработки с api ###
			remoteHost: "http://vinsproduction.com"

			### Путь до картинок и прочей статики ###
			root: ""

			### Визуальный Дебагер ###
			box: false

		_.extend @options, options

		@name 				= @options.name
		@remoteHost 	= @options.remoteHost
		@root 				= @options.root

		@boxUri 			= @options.boxUri
		@debugUri 		= @options.debugUri

		### Дебаг режим ###
		@debugMode = /debug/.test(window.location.search)

		### Если хоста нет, значит - локальный просмотр! ###
		@local = window.location.host is "" or /localhost/.test window.location.host

		### HOST! ###
		@host = window.location.protocol + "//" + window.location.host

		### Визуальный Дебагер ###
		@boxMode = new RegExp(@boxUri).test(window.location.search) or @options.box

		### Возвращает параметры визуального дебага, напр. ?box=logs -> вернет logs ###
		@boxParams = do =>
			return [] if !@boxMode
			box = $$.urlParam(@boxUri)
			if box then box.split(',') else []

		### Дебаг режим ###
		@debugMode = new RegExp(@debugUri).test(window.location.search)

		### Возвращает параметры дебага, напр. ?debug=test -> вернет test ###
		@debugParams = do =>
			return [] if !@debugMode
			debug = $$.urlParam(@debugUri)
			if debug then debug.split(',') else []

		### Только для локальной разработки! ###
		if @local and window.WebSocket
			livereloadPort = 777 # Порт должен совпадать с портом в Gruntfile.js
			$$.includeJS "http://localhost:#{livereloadPort}/livereload.js"
			console.debug "[App > Livereload] http://localhost:#{livereloadPort}/livereload.js"

		### Настройки библиотек ###
		do @libs

		### Listeners ###
		do @listeners

		### основная инизиализация ###
		do @init

	init: ->

		$ =>

			### Дебагер ###
			if @boxMode then do @debugBox.init

			### Модели/Api ###
			if Models?
				@models = new Models

			### Контроллеры/Рендеры ###
			if Views?
				@views 	= new Views
				@views.controller()

			### Роутер ###
			if Router?
				@router = new Router
				Backbone.history.start()

			### Настройки соцсетей ###
			do @social.init

			window.console.info "[App > onLoad]", @name, "Options >", @options, " Debug >", (if  @debugMode then @debugParams else false), " Box >", (if  @boxMode then  @boxParams else false), " Browser > #{$$.browser.name} ver. #{$$.browser.version}"

			$(window).trigger("AppOnLoad")


	listeners: ->

		self = @

		#load
		@onLoad = (callback) ->
			$(window).on 'AppOnLoad', (event) ->
				return if !app?
				callback(app) if callback

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

				isBottom = top + $(window).height() >= $(document).height()
				action = if top > lastScrollTop then 'down' else 'up'
				lastScrollTop = top

				if app.debugBox.state
					app.debugBox.log "scroll", "#{action} | top: #{top}px | isBottom #{isBottom}"

				vars = {top,isBottom,action,e}

				$(window).trigger("AppOnScroll",[vars])

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

		@onLoad -> $(window).resize()

		### Hash change ###

		### Listener callback Hash
		app.onHash (v) ->
		###

		@onHash = (callback) ->

			set = false

			$(window).on 'AppOnHash', (event,v) ->
				callback(v) if callback

			if !set
				callback(window.location.hash) if callback
				set = true

		$(window).on 'hashchange', =>

			$(window).trigger("AppOnHash",[window.location.hash])

		$(window).trigger 'hashchange'

	### Scroll

	app.scroll(500)
	app.scroll(500,true)
	app.scroll('section#guests',true)
	app.scroll('section#guests',{time:500,easing:'easeOutElastic',done:function(){console.log('animate complete');}})
	app.scroll($('section#guests'))

	###
	scroll: (v,animate) ->

		time 		= animate?.time 	|| 800
		easing 	= animate?.easing || 'easeOutCubic'
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

			documentWidth  : $(document).width()
			documentHeight : $(document).height()

			bodyWidth 		: parseInt($('body').width())
			bodyHeight 		: parseInt($('body').height())

			mainWidth			: parseInt($('body > main').width())
			mainHeight		: parseInt($('body > main').height())

			headerWidth		: parseInt($('body > main > header').width())
			headerHeight	: parseInt($('body > main > header').height())

			footerWidth		: parseInt($('body > main > footer').width())
			footerHeight	: parseInt($('body > main > footer').height())
			
			sectionsWidth : parseInt($('body > main > .sections').width())
			sectionsHeight: parseInt($('body > main > .sections').height())

	### AJAX ###

	request: (options={}) ->

		return console.error '[App > api] url not set!' if !options.url

		self = @

		api 			= options.api || false
		url  			= options.url
		type 			= options.type || "GET"
		dataType 	= options.dataType || false
		contentType = options.contentType || false
		data 			= options.data || {}
		headers 	= options.headers || {}
		callback 	= options.callback || false
		logs 			= options.logs ? true

		$.support.cors = true

		ajaxData = {url,type,data,headers,crossDomain:true,cache:false}
		ajaxData.dataType = dataType if dataType
		ajaxData.contentType = contentType if contentType

		request = $.ajax(ajaxData)

		request.done (res) ->

			if logs and !api
				response = if $$.browser.msie then JSON.stringify res else res
				data 		= if $$.browser.msie then JSON.stringify data else data
				console.debug("[#{type}] #{url} | params:", data, "| success: ", response)

			callback(res,'success',false,options) if callback

		request.fail (res,err) ->

			if logs and !api
				response = if $$.browser.msie then JSON.stringify res else res
				data 		= if $$.browser.msie then JSON.stringify data else data
				console.error("[#{type}] #{url} | params:", data, "| fail: ", response, err)

			callback(res,'fail',response,options) if callback


		return

	get: (url,data={},callback) ->

		@request
			url:  url
			type:'GET'
			data: data
			callback: (res) -> callback(res) if callback

	post: (url,data={},callback) ->

		@request
			url:  url
			type:'POST'
			data: data
			callback: (res) -> callback(res) if callback

	getJSON: (url,data={},callback) ->

		@request
			url: url
			type:'GET'
			data: data
			dataType: 'json'
			callback: (res) -> callback(res) if callback


	### @api
	Пример запроса: app.api.get 'user/details', {}, (res) =>
		if res.error
				return app.errors.popup res.error
			else
				console.log res
	###

	api:


		setUrl: (url) ->
			host = if app.local then app.remoteHost else app.host
			return host + '/' + url

		get: (url,data={},callback) ->

			app.request
				api: true
				url: @setUrl(url)
				type:'GET'
				data: data
				dataType: 'json'
				headers: {'X-CSRFToken': $.cookie('csrftoken')}
				callback: (res,state,error,options) => @done(options,state,res,error,callback)

		post: (url,data={},callback) ->

			app.request
				api: true 
				url:  @setUrl(url)
				type:'POST'
				data: data
				dataType: 'json'
				headers: {'X-CSRFToken': $.cookie('csrftoken')}
				callback: (res,state,error,options) => @done(options,state,res,error,callback)

		done: (options,state,res,error,callback) ->

			if !_.isObject res
				console.error '[API] response is not object!'
				return

			if state is 'fail'

				if (res.status in [400,404]) and !_.isEmpty(res.responseJSON)
					console.debug("[#{options.type}] API #{options.url} | params:", options.data, "| error: ", res.responseJSON)
					callback(res.responseJSON) if callback

				else
					console.error("[#{options.type}] API #{options.url} | params:", options.data, "| fail", error)
					app.router.navigate '!ooops', true

			else

				console.debug("[#{options.type}] API #{options.url} | params:", options.data, "| success: ", res)
				callback(res) if callback


	### Debug monitor ###
	debugBox:

		logs: false # Отображать console.log в боксе

		state: false # Готовность к использованию 

		init: ->

			@logs  = app.boxMode and 'logs' in app.boxParams

			@state = true

			$('body').append """
				<div id="debugBox" style="max-width: 400px;background:transparent;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#60000000,endColorstr=#60000000);background: rgba(0,0,0,0.6);position:fixed;z-index:10000; right:5px; bottom:5px;color:white; padding: 10px;">
					DebugBox - #{app.name}
					<pre class="browser">browser: <span>#{$$.browser.name} ver.#{$$.browser.version}</span></pre>
					<pre class="res">resolution: <span></span></pre>
					<pre class="scroll">scroll: <span>none</span></pre>
					<pre class="route">route: <span>none</span></pre>
					<pre class="sect"></pre>
					<pre class="mediaHeight" style="color:red;"></pre>
					<pre class="mediaWidth" style="color:red;"></pre>
					<div class="log" style="margin-top: 10px; max-height: 80px;overflow-y:auto;word-wrap: break-word;"><div></div></div>
				</div>
			"""

		style:->

			el = $('#debugBox')

			el.find(".log")
				.css
					'color': '#85FF00'

				.scrollTop el.find(".log div").height()

			el.find("pre,span").css
				'font': '14px monospace'
				'padding':0
				'margin':0

		log: (place, log) ->

			switch place
				when 'log'
					$('#debugBox .log div').append """
						<pre>#{log}</pre>
						<pre>------</pre>
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


			@style()

	### Всякие библиотеки для общего пользования ###
	libs: ->

	### Социальные настройки ###
	social:

		init: ->

			@vkontakteApiId			= if app.local or /dev.site.ru/.test(app.host) then '4555300' else '4574053'
			@facebookApiId			= if app.local or /dev.site.ru/.test(app.host) then '1487802001472904' else '687085858046891'
			@odnoklassnikiApiId = ''

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

		auth: 

			vk: (callback) ->

				if !VK? then return console.warn '[App > auth > vk] VK is not defined'

				# if app.local

				# 	user =
				# 		domain: ""
				# 		sex: 2
				# 		first_name: "Ailoved"
				# 		href: "https://vk.com/id169209728"
				# 		id: "169209728"
				# 		last_name: "Ailove"
				# 		nickname: ""

				# 	console.debug '[VKONTAKTE::LOCAL > auth]', user
				# 	return callback user
				

				VK.Auth.login (r) ->

					if r.session
						console.debug '[VKONTAKTE > auth]', r.session.user
						callback r.session.user
					else
						console.error '[VKONTAKTE > auth]', r

			fb: (callback) ->

				if !FB? then return console.warn '[App > auth > fb] FB is not defined'

				# if app.local

				# 	user =
				# 		first_name: "Vins"
				# 		gender: "male"
				# 		id: "762527367142381"
				# 		last_name: "Polyakov"
				# 		link: "https://www.facebook.com/app_scoped_user_id/762527367142381/"
				# 		locale: "ru_RU"
				# 		name: "Vins Polyakov"
				# 		timezone: 4
				# 		updated_time: "2014-07-22T08:46:05+0000"
				# 		verified: true

				# 	console.debug '[FACEBOOK::LOCAL > auth]', user
				# 	return callback user


				getUser = (authResponse) ->

					FB.api '/me', (r) ->

						_.extend r, authResponse

						console.debug '[FACEBOOK > auth]', r
						callback r

				FB.getLoginStatus (r) ->

					if r.status is 'connected'
						getUser(r.authResponse)

					else

						FB.login((r) ->

							if r.authResponse
								getUser(r.authResponse)
							else
								console.error '[FACEBOOK > auth]', r

						,{scope: 'user_likes'})



		### Пост на стенку в соц. сети ###
		wallPost:

			vk: (options={}) ->


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

			fb: (options={}) ->

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

			ok: (options={}) ->
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

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				url = "http://vkontakte.ru/share.php?"
				url += "url=" + encodeURIComponent(options.url) if options.url
				url += "&title=" + encodeURIComponent(options.title.substr(0,100)) if options.title
				url += "&description=" + encodeURIComponent(options.description.substr(0,100) + '...') if options.description
				url += "&image=" + encodeURIComponent(options.image) if options.image
				url += "&noparse=true"

				@popup url

			vkCount: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				window.VK.Share = {} if !window.VK.share
				window.VK.Share.count = (index, count) ->
					console.debug '[VK Share count]', count
					options.callback(count) if options.callback

				$.getJSON 'http://vkontakte.ru/share.php?act=count&index=1&url=' + escape(options.url) + '&format=json&callback=?'

			ok: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1"
				url += "&st._surl=" + encodeURIComponent(options.url) if options.url
				url += "&title=" + encodeURIComponent(options.title) if options.title
				url += "&st.comments=" + encodeURIComponent(options.description) if options.description
				

				@popup url

			okCount: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				window.ODKL = {} if !window.ODKL
				window.ODKL.updateCountOC = (a, count, b, c) ->
					console.debug '[OK Share count]', count
					options.callback(count) if options.callback

				$.getJSON 'http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&callback=?&ref=' + escape(options.url)

			fb: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				FB.ui
					method: 'feed',
					link: options.url
					name: options.title.substr(0,100) if options.title
					caption: options.description.substr(0,100) + '...' if options.description
					picture: options.image if options.image
				, (res) ->

			fbCount: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				$.getJSON 'http://api.facebook.com/restserver.php?method=links.getStats&callback=?&urls=' + escape(options.url) + '&format=json', (data) ->
					console.debug '[FB Share count]', data[0].share_count
					options.callback(data[0].share_count) if options.callback

			tw: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				url = "http://twitter.com/share?"
				url += "text=" + encodeURIComponent(options.title) if options.title
				url += "&url=" + encodeURIComponent(options.url) if options.url
				url += "&counturl=" + encodeURIComponent(options.url) if options.url

				@popup url

			twCount: (options={}) ->

				if !options.url
					if app.local
						options.url = app.remoteHost + window.location.pathname + window.location.hash
					else
						options.url = window.location.href

				$.getJSON 'http://urls.api.twitter.com/1/urls/count.json?url=' + escape(options.url) + '&callback=?', (data) ->
					console.debug '[TW Share count]', data.count
					options.callback(data.count) if options.callback

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
