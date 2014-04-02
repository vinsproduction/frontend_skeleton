class Gallery

	height: '100%'
	width : '100%'

	autoplay: 2000 # or false

	easing: 'easeOutExpo'
	animateTime: 500

	paginationON: true
	controlsON: true
	thumbsON: true		

	thumbsW: 600
	thumbW: 	103
	thumbH: 	103

	currentIndex: 1
	interval: null
	animate: false


	init: (@slides) ->

		@$gallery 		= $("#gallery")
		@$preloader 	= $('#gallery-preloader')

		@$controlPrev 	= $('#gallery-prev')
		@$controlNext 	= $('#gallery-next')
		@$controlPrev.hide()
		@$controlNext.hide()

		@$pagination 	= $('#gallery-pagination')
		@$pagination.hide()

		@$thumbsControlPrev = $('#gallery-thumbs-prev')
		@$thumbsControlNext = $('#gallery-thumbs-next')
		@$thumbsControlPrev.hide()
		@$thumbsControlNext.hide()

		@$gallery.html """
			<div class="wrapper">
				<div class="items"></div>
			</div>
		"""

		@$wrapper 		= @$gallery.find('.wrapper')
		@$items 			= @$gallery.find('.items')

		$.each slides, (i,v) =>

			@slides[i]['data-index'] = i

			@$items.append """
				<div class="item" data-index="#{i}">
					<img src="#{v.image}" />
				</div>
			"""

			# Когда итемы наполнились, ставим первый и последний неактивный слайд - рыба!
			if i is @slides.length-1

				@$items.prepend """
					<div class="item fish first">
						<img src="#{@slides[@slides.length-1]['image']}" />
					</div>
				"""

				@$items.append """
					<div class="item fish last">
						<img src="#{@slides[0]['image']}" />
					</div>
				"""


				@$item 			= @$items.find('.item')
				@$img 			= @$item.find('img')
				@itemsCount 	= @$item.size()
		
				_self = @

				@$items.css 'visibility':'hidden'

				itemsCountLoaded = 0
				@$img.load ->


					itemsCountLoaded++

					# Когда все картинки в итемах отгрузились
					if itemsCountLoaded is _self.itemsCount

						_self.$items.css 'visibility':'visible'
						_self.$preloader.hide()

						do _self.controls if _self.controlsON
						do _self.pagination if _self.paginationON
						do _self.thumbs if _self.thumbsON
			
						$(window).on "hashchange", ->

							_self.setSize ->
								_self.goTo 0
								do _self.autoPlay if _self.autoplay
						
						$(window).resize ->
							_self.setSize ->
								_self.goTo 0
								do _self.autoPlay if _self.autoplay

						$(window).resize()
	
						$(window).on "DOMMouseScroll mousewheel", (e) ->

							clearInterval _self.interval
							return if _self.animate

							if e.originalEvent.detail > 0 or e.originalEvent.wheelDelta < 0
								#scroll down
								index = if _self.currentIndex >= _self.slides.length-1 then 0 else _self.currentIndex+1
								_self.goTo index
							else
								#scroll up
								index = if _self.currentIndex <= 0 then _self.slides.length-1 else _self.currentIndex-1
								_self.goTo index

						do _self.load

	load: -> console.log 'gallery load!'

	resetSize: ->

		height = 0

		@$gallery.height height
		@$items.height height

		@$item.height height
		@$img.height height

	setSize: (callback) ->

		_self = @

		do @resetSize

		height = if @height is '100%' then $(window).height() else @height

		height = height - @thumbH - 20

		@$gallery.height height
		@$items.height height

		@$item.height height
		@$img.height height

		width = if @width is '100%' then $(window).width() else @width
	
		@$gallery.width width

		do @setSizeThumbs if _self.thumbsON

		@itemsWidth = 0

		$.each @$item, (i) ->

			$img = $(@).find('img')

			w = $img.width()

			$(@).width w

			_self.itemsWidth += w

			if i is _self.itemsCount - 1

				_self.$items.width _self.itemsWidth

				_self.animatePositions(callback)

		console.log 'set size gallery constants:', @width, @height, 'set:', width, height

	animatePositions: (callback) ->

		# расставляем позиции!

		@steps = []

		w = @$items.find(".item.fish.first img").width()

		gw = if @width is '100%' then $(window).width() else @width

		@steps.push gw/2-@$items.find(".item[data-index='0'] img").width()/2-w

		for i in [0...@slides.length-1]

			w += @$items.find(".item[data-index='#{i}'] img").width()
			@steps.push gw/2-@$items.find(".item[data-index='#{i+1}'] img").width()/2-w

			if i is @slides.length-2
				do callback

	autoPlay: ->

		autoIndex = 0
		clearInterval @interval
		@interval = setInterval(=>
			if autoIndex is @slides.length-1
				autoIndex = 0
			else
				autoIndex++
			@goTo autoIndex
		,@autoplay)

	build: (index=0) ->

		_self = @

		console.log "currentIndex -> #{index}"

		@currentIndex = parseInt(index)

		do @beforeAnimation

		@animate = true

		@$items.addClass('speed')

		.animate(

			left: @steps[index]

		,@animateTime,@easing, ->

			_self.animate = false
			$(@).removeClass('speed')

			do _self.afterAnimation

		)

	beforeAnimation: ->

		if @thumbsON
			index = @$current.attr('data-index')
			@$thumbs.find('.item').removeClass 'current'
			@$thumbs.find(".item[data-index='#{index}']").addClass 'current'

	afterAnimation: ->

		@$item.removeClass('prev').removeClass('current').removeClass('next')
		@$prev.addClass 'prev'
		@$current.addClass 'current'
		@$next.addClass 'next'

	controls: ->

		_self = @

		@$controlNext.click =>
			clearInterval _self.interval
			return if _self.animate
			@goTo @currentIndex+1
			return false

		@$controlPrev.click =>
			clearInterval _self.interval
			return if _self.animate
			@goTo @currentIndex-1
			return false

		@$item.click ->
			clearInterval _self.interval
			return if _self.animate
			if $(@).is('.fish.first')
				 _self.goTo _self.itemsCount-3

			else if $(@).is('.fish.last')
				 _self.goTo 0
			else
				return if $(@).is('.current')
				_self.goTo parseInt($(@).attr('data-index'))

		@$controlPrev.show()
		@$controlNext.show()

	pagination: ->

		_self = @

		$.each @$item.not('.fish'), ->

			itemId = $(@).attr 'data-index'

			pag = """<a href="#" data-index="#{itemId}">#{itemId}</a>"""

			$pag = $(pag)

			$pag.click ->
				clearInterval _self.interval
				return if _self.animate
				_self.goTo parseInt($(@).attr 'data-index')
				return false

			_self.$pagination.append $pag

		@$pagination.show()
			
	goTo: (index=0) ->

		console.log "go to #{index}"

		$findItem = @$items.find(".item[data-index='#{index}']")
	
		if $findItem.size()

			@$item.removeClass('prev').removeClass('current').removeClass('next')

			@$prev = $findItem.prev()

			@$current = $findItem
	
			@$next = $findItem.next()

			@build index
		
	thumbs: ->

		@$thumbs = $('#gallery-thumbs')

		_self = @

		@$thumbs.append """
			<div class="items" style="height:#{@thumbH}px;"></div>
		"""

		@$thumbItems = @$thumbs.find('.items')

		#test
		#$.each [0,1,2,3,4,5], =>

		$.each @slides, (i,v) ->

			indx 		= v['data-index']
			imgSrc 	= v.thumb

			thumb = """
				<div class="item" data-index="#{indx}">
					<img src="#{imgSrc}" />
				</div>
			"""

			$thumb = $(thumb)

			_self.$thumbItems.append $thumb

			$thumb.height _self.thumbH
			$thumb.width _self.thumbW

			$thumb.find('img').css
				height: 	_self.thumbH
				width: _self.thumbW

			if i is _self.slides.length-1
				_self.$thumbItem = _self.$thumbItems.find('.item')
				do _self.setSizeThumbs
				do _self.thumbs_controls

	setSizeThumbs: ->

		@thumbsW = if @width is '100%' then $(window).width() else @width
		@$thumbs.width @thumbsW
		@$thumbs.height @thumbH

		@thumbItemsW = @thumbW*@$thumbItem.size()
		@$thumbItems.width @thumbItemsW

	thumbs_controls: ->

		_self = @

		@$thumbItem.click ->

			clearInterval _self.interval
			return if _self.animate
			_self.goTo parseInt($(@).attr 'data-index')
			return false

		@$thumbsControlNext.click =>

			clearInterval @interval
			return if @animate

			pos = @$thumbItems.position().left - @thumbW

			if pos - @thumbsW + @thumbW >= -(@thumbItemsW)

				@$thumbItems.stop().animate
					left: pos

			return false

		@$thumbsControlPrev.click =>

			clearInterval @interval
			return if @animate

			pos = @$thumbItems.position().left + @thumbW

			#console.log pos

			if pos <= 0
				@$thumbItems.stop().animate
					left: pos

			return false

		@$thumbsControlPrev.show()
		@$thumbsControlNext.show()



window.gallery = new Gallery()