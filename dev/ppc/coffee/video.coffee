class Video

	width: 1000

	wrapperWidth: 1000
	wrapperHeight: 500

	fullscreen: false

	poster: false

	autoplay: true
	preload: true
	loop: true
	controls: false

	valume: 0.5
	startTime: 0

	_isLoad: 0
	_metaDataloaded: false

	constructor: (opt={}) ->

		for k,v of opt
			@[k] = v

		@_width 	=  @width  = @width
		@_height =  @height = @width*9/16
		@_wrapperWidth 	= @wrapperWidth
		@_wrapperHeight 	= @wrapperHeight
		
		$ => do @init

	init: ->

		@Player = videojs "player",
			'width':'auto'
			'height': 'auto'
			"controls": @controls
			"preload": @preload
			"loop": @loop
			'techOrder': if $$.browser.msie then ['flash'] else ['html5','flash']
			'poster': @poster

		@wrapperEl 	= $('#video')
		@playerEl 	= $("#player")
		@videoEl 	= $("#player video")

		@orignalWidth = @playerEl.width()

		if @fullscreen
			@mode = "fullscreen"
			do @fullScreen
		else
			@mode = "normalscreen"
			do @normalScreen

		$('.vjs-control-bar').show() if @controls
		$('.vjs-poster').show() if @poster
		$('.vjs-loading-spinner').show() if @preload
				
		@Player.on "pause", => 
		@Player.on "play", =>
		@Player.on "ended", => #@stop()

		@play() if @autoplay

		@Player.ready =>

			console.debug '[Video] ready'

		@Player.on "loadedmetadata", =>

			if !@_metaDataloaded

				console.debug '[Video] loadedmetadata'

				@Player.currentTime(@startTime)
				@Player.volume(@valume)

				@_metaDataloaded = true

		@Player.on "progress", =>

			@_isLoad = Math.ceil(@Player.bufferedPercent()*100)
			#console.log "[Video] progress - " + @_isLoad

		$(window).resize =>
			do @fullScreen if @mode is "fullscreen"

	resize: ->

		@wrapperEl.css
			'width': @wrapperWidth
			'height': @wrapperHeight

		@playerEl.css 
			'width': @width
			'height': @height

		@videoEl.css
			'top':  @wrapperHeight/2 - @height/2
			'left':  @wrapperWidth/2 - @width/2
			'width': @width
			'height': @height

		$('.vjs-loading-spinner').css
			'top':  @wrapperHeight/2
			'left':  @wrapperWidth/2

	fullScreen: ->

		@mode = 'fullscreen'

		console.log '[Video] mode', @mode

		@wrapperWidth = $(window).width()
		@wrapperHeight = $(window).height()

		if @wrapperHeight*16/9 < @wrapperWidth

			@width  = @wrapperWidth
			@height = @wrapperWidth*9/16

		else

			@width  = @wrapperHeight*16/9
			@height = @wrapperHeight

		do @resize

	normalScreen: ->

		@mode = 'normalscreen'

		console.log '[Video] mode', @mode

		@wrapperWidth = @_wrapperWidth
		@wrapperHeight = @_wrapperHeight

		@width  = @_width
		@height = @_height

		do @resize

	play: ->

		@Player.play()

	stop: ->

		@Player.pause()
		@Player.currentTime(0)

	pause: ->

		@Player.pause()

	mute: (volume) ->

		@Player.volume(volume)

	time: (sec) ->

		@Player.volume(sec)