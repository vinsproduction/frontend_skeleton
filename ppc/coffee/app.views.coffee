### Prototype View ###

class PrototypeView

	render_debug: true # отображать название темплейтов и передаваемых в них переменных

	constructor: ->

		@varconstants = {}

		do @init

	generateRenders: (template =  @template) ->

		_.each template, (val,key) =>

			# Generate Sourse for templates
			if !@templateSourse then @templateSourse = {}
			@templateSourse[key] = $.trim val.html()

			# Generate Render for templates
			if !@render then @render = {}
			@render[key] = (options={}) => @doRender key, @template[key], @templateSourse[key], options

			# Generate preRender for templates
			if !@preRender then @preRender = {}
			@preRender[key] = (options={}) => @doPreRender key, @template[key],options

		@renderAll = (options) =>

			_.each template, (val,key) =>
				do @render[key]

	doPreRender: (templateName, $el, options) ->

		try

			color 	= if options and options.color then options.color else "#000"
			bg 			= if options and options.bg then options.bg else "none"
			text 		= if options and options.text then options.text else true
			width 	= if options and options.width then parseInt(options.width) + "px" else "100%"
			height 	= if options and options.height then parseInt(options.height) + "px" else "100%"
			top  		= if options and options.top then parseInt(options.top) + "px" else (parseInt(height)/2 - 10) + "px" # 10 - погрешность от размера шрифта

			if @render_debug then console.log "[preRender #{templateName}] loadtext:",text

			if text

				$el.html """
					<div style="width: #{width}; height: #{height}; background: #{bg}; position:relative; clear:both;">
						<div style="top:#{top}; text-align: center; position: relative; clear:both; color: #{color};">
							#{text}
						</div>
					</div>
				"""

			else # Картинка - прелоадер !

				$el.html """
					<div id="preload" style="width: #{width}; height: #{height}; background: #{bg};">
						<div class="inner" style="top:#{top};">
							<div class="clock"></div>
							<div class="loader"></div>
						</div>
					</div>
				"""
	
		catch error
			console.error '[preRender] template undefined'
			console.error error

	doRender: (templateName, $el, sourse, options={method:"html"}) ->

		if @render_debug then console.log "[Render #{templateName}]", '| @vars:', @vars

		switch options.method
			when 'append' 	then $el.append( Mustache.to_html(sourse, @vars) )
			when 'prepend' then $el.prepend( Mustache.to_html(sourse, @vars) )
			else $el.html( Mustache.to_html(sourse, @vars) )

	init: ->

	controller: (@opt={}) ->

	actions: ->

	doImage: (src,classes="") ->
		return if !src or src is ""
		if !/http:\/\//.test(src) then src = app.root + src
		photo =
			"""
				<img src="#{src}" class="#{classes}" >
			"""
		return photo

### Views ###

class allView

	constructor: ->

		@sections = $("body > main > .sections")
		@section 	= @sections.find('> section')

		#app.onScroll (data) -> console.log '=> onScroll', data
		#app.onResize (data) -> console.log '=> onResize', data

class IndexView extends PrototypeView

	init: ->

	controller: (@opt={}) ->

		@el = $("main.view-index")

		console.log 'Hello! This is index controller'

class IndexRenderView extends PrototypeView

	init: ->

	controller: (@opt={}) ->

		@el = $("main.view-index-render")

		@template = 
			'text' : @el.find('.text')

		do @generateRenders

		@vars = {} #reset vars
		@preRender['text'](text: 'Load...')

		app.models.user.getDetails {}, (res) =>
			if res.error
				return app.errors.popup(res.error)
			else
				@renderResponse(res)
		
	renderResponse: (data) ->

		_.extend @vars, @varconstants
		_.extend @vars, data

		@doImage(@vars.avatar) if @vars.avatar

		do @render['text']
		do @actions

	actions: ->

class IndexScroll extends PrototypeView

	init: ->

	controller: (@opt={}) ->

		@el = $("main.view-index-scroll")

		@router = new indexScrollRouter
		Backbone.history.start()

		self = @

		@el.find('header nav#menu li a[data-page]').click ->
			console.log "!" + $(@).attr('data-page')
			self.router.navigate "!" + $(@).attr('data-page'),true
			return false

		### Если надо открывать каждый блок на всю страницу ###
		app.onResize (size) =>
			app.views.all.section.css 
				'min-height' : size.windowHeight

		$(window).trigger('resize')

class IndexHash extends PrototypeView

	init: ->

	controller: (@opt={}) ->

		@el = $("main.view-index-hash")

		@router = new indexHashRouter
		Backbone.history.start()

		self = @

		@el.find('header nav#menu li a[data-page]').click ->
			self.router.navigate "!" + $(@).attr('data-page'),true
			return false


### ============ Объявляем классы! =========== ###

class Views

	controller: ->

		@all  			= new allView
		@index 			= new IndexView
		@indexRender= new IndexRenderView
		@indexScroll= new IndexScroll
		@indexHash 	= new IndexHash

