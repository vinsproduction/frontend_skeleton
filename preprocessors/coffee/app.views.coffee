# Prototype View

class PrototypeView

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

		

			loadtext = if options and options.t then options.t else "Load..."
			width 	= if options and options.w then parseInt(options.w) + "px" else "auto"
			height 	= if options and options.h then parseInt(options.h) + "px" else "100px"
			margin  	= if options and options.m then parseInt(options.m) + "px" else (parseInt(height)/2 - 10) + "px" # 10 - погрешность от размера шрифта

			console.log "[preRender #{templateName}] loadtext:",loadtext

			if loadtext
				$el.css({'background-color':'#FFF'}).html """
					<div class="prerender" style="position:relative;height:#{height};width:#{width};text-align:center;">
						<p style="position: relative; top:#{margin};">#{loadtext}</p>
					</div>
				"""
			else
				$el.empty()
		try
			//
		catch error
			console.error 'template undefined'
			console.error error

	doRender: (templateName, $el, sourse, vars = @vars) ->

		console.log "[Render #{templateName}] @vars:",@vars

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

class IndexView extends PrototypeView

	init: ->

		@el = $("section#test-render")

		@template = 
			'content' : @el.find('.content')

		do @generateRenders

	resize: -> 
		# do resize
	
	controller: (@opt={}) ->

		@vars = {} #reset vars

		@preRender['content'](t: 'Load...',h:130)

		setTimeout(=>
			data = 
				test: 'Mustache rendered'

			@renderResponse(data)
		,2000)
		
	renderResponse: (data) ->
	
		_.extend @vars, @varconstants
		_.extend @vars, data

		do @render['content']
		do @listener

	listener: ->
		
		@template['content'].find('h1').css('color':'green')


		


