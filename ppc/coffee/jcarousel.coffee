$ ->

	select = $('.select')

	carousel = $('.jcarousel')

		.jcarousel
			wrap: 'both' #circular
			animation: 
				duration: 600
				easing: 'linear'

		.jcarouselAutoscroll
			interval: 3000,
			target: '+=1',
			autostart: false

		.on 'jcarousel:targetin', '.item', ->

			targetIndex = $(@).index()

			select.removeClass 'active'
			select.eq(targetIndex).addClass 'active'

		.data('jcarousel')

	select.click ->

		targetIndex = $(@).index()

		carousel.scroll(targetIndex)