### 
	Front-end Skeleton
	rev. 09.07.2014
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

			### Визуальный дебаггер ###
			box: false


		_.extend @options, options

		@name 				= @options.name
		@remoteHost 	= @options.remoteHost
		@root 				= @options.root
		@box 					= @options.box

		@boxUri 			= @options.boxUri
		@debugUri 		= @options.debugUri

		# Настройка window.console
		# do @console

		do @listeners

		### Дебаг режим ###
		@debugMode = /debug/.test(window.location.search)

		### Если хоста нет, значит - локальный просмотр! ###
		@local = window.location.host is "" or /localhost/.test window.location.host

		### HOST! ###
		@host = window.location.protocol + "//" + window.location.host

		### Визуальный Дебагер ###
		@boxMode = new RegExp(@boxUri).test(window.location.search)

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

			### Настройки соцсетей ###
			do @social.init

			window.console.info "[App > onLoad]", @name, "Options >", @options, " Debug >", (if  @debugMode then @debugParams else false), " Box >", (if  @boxMode then  @boxParams else false), " Browser > #{$$.browser.name} ver. #{$$.browser.version}"

			$(window).trigger("AppOnLoad")


	console: ->

		self = @

		window.originalConsole = console
		window.console =
			log: ->
			debug: ->
			warn: ->
			info: ->
			error: ->


		log = ->

			type = arguments[0]
			args = _.rest(arguments)

			log = ""
			for argument in args

				log += if _.isObject(argument) then $$.jlog(argument) else argument
				log += " "
			
			log = _.escape log

			try
				switch type
					when 'log' 		then this.log.apply(this,args)
					when 'debug' 	then this.debug.apply(this,args)
					when 'warn' 	then this.warn.apply(this,args)
					when 'info' 	then this.info.apply(this,args)
					when 'error'	then this.error.apply(this,args)
	
			catch e
				switch type
					when 'log' 		then this.log(log)
					when 'debug' 	then this.debug(log)
					when 'warn' 	then this.warn(log)
					when 'info' 	then this.info(log)
					when 'error' 	then this.error(log)

			self.debugBox.log('log', log) if ('box' in self.debug or self.box) and self.debugBox.state and self.debugBox.logs

			return

		window.console.log 	= _.bind log, window.originalConsole,'log'
		window.console.debug = _.bind log, window.originalConsole,'debug'
		window.console.warn 	= _.bind log, window.originalConsole,'warn'
		window.console.info 	= _.bind log, window.originalConsole,'info'
		window.console.error = _.bind log, window.originalConsole,'error'


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

			return if !app?

			top = self.scroll()

			if top isnt lastScrollTop

				action = if top > lastScrollTop then 'down' else 'up'
				lastScrollTop = top

				if app.debugBox.state
					app.debugBox.log "scroll", "#{action} | top: #{top}px"

				vars = {top,action,e}

				$(window).trigger("AppOnScroll",[vars])

		@onLoad -> $(window).scroll()

		### Resize ###

		### Listener callback resize
		app.onResize (v) ->
		###
		@onResize = (callback) ->
			$(window).on 'AppOnResize', (event,v) ->
				callback(v) if callback

		$(window).resize =>

			return if !app?

			vars = app.size()

			if app.debugBox.state
				app.debugBox.log "sect", "header: #{vars.headerHeight}px | sections: #{vars.sectionsHeight}px | footer: #{vars.footerHeight}px"
				app.debugBox.log "res", "#{vars.windowWidth}px x #{vars.windowHeight}px"

			$(window).trigger("AppOnResize",[vars])

		@onLoad -> $(window).resize()

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


	### @request
	Пример запроса:
		app.request
			url: 'user/details'
			type:'GET'
			data: {}
			callback: (res) -> callback(res) if callback
	###

	request: (options={}) ->

		return console.error '[App > api] url not set!' if !options.url

		host 			= if @local then @remoteHost else @host
		url  			= host + "/" + options.url
		type 			= options.type || "GET"
		dataType 	= options.dataType || false
		data 			= options.data || {}
		callback 	= options.callback || false
		logs 			= options.logs ? true

		$.support.cors = true
		ajaxData = {url,type,data,crossDomain:true,cache:false}
		ajaxData.dataType = dataType if dataType

		request = $.ajax(ajaxData)

		request.done (res) =>

			if logs
				response = if $$.browser.msie then JSON.stringify res else res
				data 		= if $$.browser.msie then JSON.stringify data else data
				console.debug("[App > #{type}] #{url} | params:", data, "| success: ", response)

			callback res if callback

		request.fail (res,err) =>

			if logs
				response = if $$.browser.msie then JSON.stringify res else res
				data 		= if $$.browser.msie then JSON.stringify data else data
				console.error("[App > #{type}] #{url} | params:", data, "| fail: ", response, err)


		return

	### @api
	Пример запроса: app.api.get 'user/details', {}, (res) =>
		if res.error
				return app.errors.popup res.error
			else
				console.log res
	###

	api:

		get: (url,data={},callback) ->

			app.request
				url: url
				type:'GET'
				data: data
				dataType: 'json'
				callback: (res) ->
					# if res.status is "error"
					# 	console.error("[App > api] #{url} | error: ", res.message)
					callback(res) if callback

		post: (url,data={},callback) ->

			app.request
				url: url
				type:'POST'
				data: data
				dataType: 'json'
				callback: (res) ->
					# if res.status is "error"
					# 	console.error("[App > api] #{url} | error: ", res.message)
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
