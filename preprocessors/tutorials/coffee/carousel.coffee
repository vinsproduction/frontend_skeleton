class Carousel

	el: '#carousel'

	height: 500
	width : 900

	itemHeight: 500
	itemWidth: 300

	start: 0

	autoplayON: false
	autoplayTime: 3000

	easing: 'easeOutExpo'
	animateTime: 500

	paginationON: false
	controlsON: false

	load: ->
	before: (vars) ->
	after: (vars) ->

	interval: null
	animate: false

	constructor: (options) ->

		for k,v of options
			@[k] = v

		$ => @init()

	init: ->

		_self = @

		@$carousel 		= $(@el)

		@$controlPrev 	= $("#{@el}-prev")
		@$controlNext 	= $("#{@el}-next")
		@$controlPrev.hide()
		@$controlNext.hide()

		@$pagination 	= $("#{@el}-pagination")
		@$pagination.hide()

		@$items 			= @$carousel.find('.items')
		@$item 			= @$items.find('>.item')

		@itemsCount 	= @$item.size()

		@$carousel.css 'overflow':'hidden'
		@$item.css 'overflow':'hidden','float':'left'
		@$items.css 'position':'relative'

		@$item.each (i) ->

			$(@).attr('data-index', i)

			if i is _self.itemsCount-1

				do _self.controls if _self.controlsON
				do _self.pagination if _self.paginationON
				do _self.setSize

				_self.goTo(_self.start)

				do _self.autoplay if _self.autoplayON

				do _self.load

	setSize: ->

		_self = @

		@$carousel.width(@width)
		@$carousel.height(@height)

		@$items.height(@height)

		@marginsH = parseInt(@$item.css('padding-left'))+parseInt(@$item.css('padding-right'))+parseInt(@$item.css('margin-left'))+parseInt(@$item.css('margin-right'))+parseInt(@$item.css('border-left'))+parseInt(@$item.css('border-right'))
		@marginsV = parseInt(@$item.css('padding-top'))+parseInt(@$item.css('padding-bottom'))+parseInt(@$item.css('margin-top'))+parseInt(@$item.css('margin-bottom'))+parseInt(@$item.css('border-top'))+parseInt(@$item.css('border-bottom'))

		@itemsWidth = 0

		@$item.each (i) ->


			itemWidth = _self.itemWidth

			_self.$item.width(itemWidth)
			_self.$item.height(_self.height-_self.marginsV)

			_self.itemsWidth += (itemWidth+_self.marginsH)

			if i is _self.itemsCount-1

				_self.$items.width(_self.itemsWidth)

	autoplay: ->

		autoIndex = 0
		clearInterval @interval
		@interval = setInterval(=>
			if autoIndex is @itemsCount-1
				autoIndex = 0
			else
				autoIndex++
			@goTo autoIndex
		,@autoplayTime)

	build: ->

		_self = @

		if @itemsWidth <= @width
			return do @afterAnimation

		visibleIndexes = []
		visibleWidth = 0
		diff = 0

		for i in [@currentIndex...@itemsCount]
			
			if visibleWidth <= @width
				visibleIndexes.push i

			visibleWidth += @itemWidth+@marginsH

			if visibleWidth >= @width
				diff =  Math.abs(@width - visibleWidth)
				break

		left = if diff then -(@itemWidth+@marginsH)*@currentIndex else -(@itemWidth+@marginsH)*@currentIndex + (@width - (@itemWidth+@marginsH)*visibleIndexes.length)

		@animation(left)

	animation: (left) ->

		@animate = true

		@$items.addClass('speed')

		.animate(

			left: left

		,@animateTime,@easing, =>

			@animate = false
			@$items.removeClass('speed')

			do @afterAnimation

		)

	beforeAnimation: ->

		if @currentIndex is 0
			@$controlPrev.hide()
		else
			@$controlPrev.show()

		if @currentIndex is @itemsCount-1
			@$controlNext.hide()
		else
			@$controlNext.show()

		@$item.removeClass('prev').removeClass('current').removeClass('next')
		@$item.filter("[data-index=#{@prevIndex}]").addClass('prev')
		@$item.filter("[data-index=#{@currentIndex}]").addClass('current')
		@$item.filter("[data-index=#{@nextIndex}]").addClass('next')

		if @paginationON
			@$pagination.find("a").removeClass('current')
			@$pagination.find("a[data-index=#{@currentIndex}]").addClass('current')

		vars = {prevIndex: @prevIndex,currentIndex: @currentIndex,nextIndex: @nextIndex}

		@before(vars)

	afterAnimation: ->

		vars = {prevIndex: @prevIndex,currentIndex: @currentIndex,nextIndex: @nextIndex}

		@after(vars)

	controls: ->

		_self = @

		@$controlNext.click =>
			clearInterval _self.interval
			return false if _self.animate
			@goTo @currentIndex+1
			return false

		@$controlPrev.click =>
			clearInterval _self.interval
			return false if _self.animate
			@goTo @currentIndex-1
			return false

		@$item.click ->
			clearInterval _self.interval
			return false if _self.animate
			return false if $(@).is('.current')
			_self.goTo parseInt($(@).attr('data-index'))

		@$controlPrev.show()
		@$controlNext.show()

	pagination: ->

		_self = @

		$.each @$item, ->

			itemId = $(@).attr 'data-index'

			pag = """<a href="#" data-index="#{itemId}">#{itemId}</a>"""

			$pag = $(pag)

			$pag.click ->
				clearInterval _self.interval
				return if _self.animate
				_self.goTo parseInt($(@).attr('data-index'))
				return false

			_self.$pagination.append $pag

		@$pagination.show()
			
	goTo: (index=@start) ->

		@scroll = if index < @currentIndex then 'prev' else 'next'

		$findItem = @$items.find(".item[data-index='#{index}']")
	
		if $findItem.size()

			console.log "[Carousel #{@el} > goTo] index: #{index} scroll: #{@scroll}"

			@$prev = $findItem.prev()

			@prevIndex = if @$prev.size() then parseInt(@$prev.attr('data-index')) else 0

			@$current = $findItem
			@currentIndex = parseInt(index)
	
			@$next = $findItem.next()
			@nextIndex = if @$next.size() then parseInt(@$next.attr('data-index')) else @itemsCount-1

			do @beforeAnimation

			do @build

			return $findItem

		return false
