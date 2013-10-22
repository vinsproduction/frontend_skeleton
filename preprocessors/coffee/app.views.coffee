# Prototype View

class PrototypeView

	varconstants: {} # Varibles для Mustache парсера

	preconstructor: ->

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

			loadtext = options.t ? "Загрузка..."
			width 	= parseInt(options.w) + "px" || "100%"
			height 	= parseInt(options.h) + "px" || "100px"

			console.log "[preRender #{templateName}] loadtext:",loadtext

			if loadtext
				$el.css({'background-color':'#FFF'}).html """
					<div style="padding:10px;height:#{height};width:#{width};"><center>#{loadtext}</center></div>
				"""
			else
				$el.empty()
	
		catch error
			console.error 'template undefined'
			console.error error

	doRender: (templateName, $el, sourse, vars = @vars) ->

		console.log "[Render #{templateName}] @vars:",@vars

		$el.removeAttr('style').html( Mustache.to_html(sourse, vars) )

	resize: (fixed) ->

		sections =
			el 	: $('body > main > .sections')

		$main = $('body > main')

		mainH			= parseInt($main.height())
		headerH		= parseInt($('header').height())
		footerH 		= parseInt($('footer').height())
		sectionsH 	= mainH - headerH - footerH

		if fixed

			sections.height = sectionsH
			sections.el.height sections.height
			$('body').css('overflow-y':'hidden')
			$('footer').css('position': 'fixed')

		else

			sections.height = 'auto'
			sections.el.height sections.height
			$('body').css('overflow-y':'auto')
			$('footer').css('position': 'relative')

		app.debugBox.log "sect", "header: #{headerH}px | sections: #{sectionsH}px | footer: #{footerH}px"
		app.debugBox.log "res", "#{$main.width()} x #{$main.height()}"
	
class IndexView extends PrototypeView

	constructor: ->

		do @preconstructor

		@el =  $("section#index")

		do @resizeit
		$(window).resize => do @resizeit

	resizeit: ->
		@resize('fixed')
		#@resize()

	controller: (params) ->

		


