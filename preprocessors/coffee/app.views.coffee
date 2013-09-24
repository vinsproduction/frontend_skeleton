# Prototype View

class PrototypeView

	varconstants: {} # Varibles для Mustache парсера

	preconstructor: ->

		@localView = do ->

			if "localview" in app.debug
				# console.warn """
				# ==================
				# Warn! [View::local]
				# ==================
				# """
				return true
			else
				return false

		@varconstants.root = if @localView then "" else window.app.root

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

	
class ArticlesView extends PrototypeView

	constructor: ->

		do @preconstructor

		@el =  $("section#articles")

		@template = 

			'new'		: @el.find(".new")
			'popular': @el.find(".popular")

		do @generateRenders


	controller: (params) ->

		@vars = {} #reset vars

		@preRender['new']()
		@preRender['popular']()

		# Models
		@articles = new Articles {@localView}

		@articles.get (data) => @renderResponse data

	listeners: ->

	renderResponse: (data) ->

		_.extend @vars, @varconstants	
		_.extend @vars, data
		
		do @render['new']
		do @render['popular']

		do @listeners

