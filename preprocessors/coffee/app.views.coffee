### Prototype View ###

class PrototypeView

	render_debug: true # отображать название темплейтов и передаваемых в них переменных

	constructor: ->

		@varconstants = {}

		do @doResize
		$(window).resize => do @doResize

		do @init

	generateRenders: (template =  @template) ->

		_.each template, (val,key) =>

			# Generate Sourse for templates
			if !@templateSourse then @templateSourse = {}
			@templateSourse[key] = $.trim val.html()

			# Generate Render for templates
			if !@render then @render = {}
			@render[key] = => @doRender key, @template[key], @templateSourse[key]

			# Generate preRender for templates
			if !@preRender then @preRender = {}
			@preRender[key] = (options={}) => @doPreRender key, @template[key],options

		@renderAll = (options) =>

			_.each template, (val,key) =>
				do @render[key]

	doPreRender: (templateName, $el, options) ->

		try

			color 	= if options and options.c then options.c else "#000"
			loadtext = if options and options.t then options.t else false
			width 	= if options and options.w then parseInt(options.w) + "px" else "auto"
			height 	= if options and options.h then parseInt(options.h) + "px" else "100px"
			margin  	= if options and options.m then parseInt(options.m) + "px" else (parseInt(height)/2 - 10) + "px" # 10 - погрешность от размера шрифта

			if @render_debug then console.log "[preRender #{templateName}] loadtext:",loadtext

			if loadtext
				$el.html """
					<div class="prerender" style="position:relative;height:#{height};width:#{width};text-align:center;">
						<p style="position: relative; top:#{margin}; color:#{color}">#{loadtext}</p>
					</div>
				"""
			else
				$el.empty()
	
		catch error
			console.error '[preRender] template undefined'
			console.error error

	doRender: (templateName, $el, sourse, vars = @vars) ->

		if @render_debug then console.log "[Render #{templateName}]", '| @vars:', vars

		$el.removeAttr('style').html( Mustache.to_html(sourse, vars) )

	doResize: (callback) ->

		@sections =
			el 	: $('body > main > .sections')

		headerH		= parseInt($('body > main > header').height())
		footerH 		= parseInt($('body > main > footer').height())
		sectionsH 	= parseInt($('body > main > .sections').height())
			
		app.debugBox.log "sect", "header: #{headerH}px | sections: #{sectionsH}px | footer: #{footerH}px"
		app.debugBox.log "res", "#{$(window).width()}px x #{$(window).height()}px"

		do @resize

	resize: ->

	init: ->

	controller: (@opt={}) ->

	actions: ->

	doImage: (src,classes="") ->
		return if !src or src is ""
		if !/http:\/\//.test(src) then src = app.host + src
		photo =
			"""
				<img src="#{src}" class="#{classes}" >
			"""
		return photo

### Views ###

class IndexView extends PrototypeView

	init: ->

		@el = $("index")

		@template = 
			'example' : @el.find('.example')

		do @generateRenders

	controller: (@opt={}) ->

		@vars = {} #reset vars
		@preRender['example'](t: 'Load...',h:130)
		app.models.user.get {}, (res) =>
			if res.error
				return app.errors.popup res.error
			else
				@renderResponse(res)
		
	renderResponse: (data) ->
		_.extend @vars, @varconstants
		_.extend @vars, data

		@doImage(@vars.avatar) if @vars.avatar

		do @render['example']
		do @actions


		
### ============ Объявляем классы! =========== ###

class Views

	constructor: ->

		@index = new IndexView

