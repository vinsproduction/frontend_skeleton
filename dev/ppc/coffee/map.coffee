### Карта этажей ###

jQuery.support.cors = true
jQuery.ajaxSetup({ cache: false, crossDomain: true})

class Map

	wrapperWidth: 660
	wrapperHeight: 564
	wrapperBgColor: ''

	mapWidth: 924
	mapHeight:790

	zoom: 0.7 #default zoom!
	zoomMax: 1.5
	zoomStep: 0.1

	# настройки айдишников на полигонах
	boxidColor: 'red'
	boxidSize: '10px'

	hilightColor: '00ffcc'

	mapPosition:
		top: 0
		left: 0
		_top: 0 #константы
		_left: 0 #константы

	# Экшен получения данных с сервака
	apiUrl: ""

	# Пусть до статики
	root: ""

	# Показывать id полигонов
	showIds: false

	# Показывать заполненные магазины
	showDoneShops: false

	# Этажи
	floors:
		'ocean': 		[-1,0,1,2]
		'krasnodar': 	[-1,1,2,3,4]
		'novosib': 		[1,2,3,4]
		'moremall': 	[-1,1,2,3]

	# Показывать слои
	showLayers: true

	# Cлои
	layers:
		'krasnodar':
			'-1': ['escalator', 'wc']
			'1': 	['escalator','elevator','wc', 'information']
			'2': 	['escalator','elevator','wc']
			'3': 	['escalator','elevator','wc']

		'novosib':
			'1': ['escalator','elevator','wc', 'metro']
			'2': ['escalator','elevator','wc']
			'3': ['escalator','elevator','wc']
			'4': ['wc']

		'moremall':
			'1': ['escalator','wc']
			'2': ['escalator','wc']
			'3': ['escalator','wc']

		'ocean':
			'-1':	['escalator','elevator']
			'0': 	['escalator','elevator','wc']
			'1': 	['escalator','elevator','wc', 'metro']
			'2': 	['escalator','elevator','wc']


	# Цвета полигнов
	areaColors: 
		'1'	: "299838"
		'2' 	: "C91C00"
		'3' 	: "248FD0"
		'4' 	: "F5DC00"
		'5' 	: "89462D"
		'6' 	: "D899EB"
		'7' 	: "F5DC00"
		'8' 	: "CD0576"
		'9 '	: "C9DFF2"
		'10' 	: "FFF49A"
		'11' 	: "B0D300"
		'12' 	: "F57C75"
		'13' 	: "0030FF"
		'14' 	: "C7898D"
		'15' 	: "436A9F"
		'16' 	: "E46B00"
		'17' 	: "E89700"
		'18' 	: "2A108C"
		'19' 	: "685B52"
		'20'	: "756500"
		'21' 	: "3E3752"
		'22'	: "5AA1AB"
		'23' 	: "BE8241"
		'24' 	: "AEF1A5"

	constructor: (opt={}) ->

		_.each opt, (v,k) =>
			@[k] = v

		@zoomMin = @zoom
		@zoom 	= @zoomMin = opt.zoom 	if opt.zoom

		opt.mapPosition = {} if !opt.mapPosition
		@mapPosition.top 	= @mapPosition._top 	= opt.mapPosition.top if opt.mapPosition.top?
		@mapPosition.left = @mapPosition._left = opt.mapPosition.left if opt.mapPosition.left?

		do @init

	init: ->
		
		@el = $('#shop-map')

		@el.find('.wrapper').css
			width: @wrapperWidth
			height: @wrapperHeight
			'background': @wrapperBgColor

		do @initZoom

		do @initActions

	initZoom: ->

		@el.find('.plus').click =>

			return if @zoom >= @zoomMax
			@zoom += @zoomStep
			@zoom = parseFloat(@zoom.toFixed(1))
			do @createMap

		@el.find('.minus').click =>

			return if @zoom <= @zoomMin
			@zoom -= @zoomStep
			@zoom = parseFloat(@zoom.toFixed(1))
			do @createMap

	setZoom: ->

		console.log '[Map > setZoom]', @zoom

		@mapPosition.top 	= @wrapperHeight/2 - @mapHeight*@zoom/2 + @mapPosition._top
		@mapPosition.left = @wrapperWidth/2 - @mapWidth*@zoom/2 + @mapPosition._left

		h = ﻿@mapHeight*@zoom
		w = @mapWidth*@zoom

		src = @el.find('.map-image').attr('src')

		if $$.browser.msie
			bg = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale');-ms-filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')"
		else
			bg = "background: url(" + src + ");background-size: 100%;"
		 
		@el.find('.map-bg').attr('style', "display:block;position:relative;padding:0;" + bg)

		@el.find('.map, .map canvas, .layers img, .map-bg, .map-image').css
			'height': h
			'width': w

		@el.find('.map-bg').css
			'left': @mapPosition.left
			'top': @mapPosition.top
		
		@el.find('.map canvas').attr('height',h + 'px').attr('width',w + 'px')


	preloaderON: ->

		@el.find('.preloader').show()
		@el.find('.pl_min, .map').css('opacity', 0).css('filter', 'Alpha(opacity=0)')

	preloaderOFF: ->
		@el.find('.preloader').hide()
		@el.find('.pl_min, .map').css('opacity', 1).css('filter', 'none')

	# Отслеживание кликов во вьюхе
	areaClick: (data) -> console.debug '[Map > area click!]', data

	# Отслеживание ховеров во вьюхе
	areaHover: (data) -> console.debug '[Map > area hover!]', data

	# Отслеживание кликов по ссылке с этажом
	floorClick: (data) -> console.debug '[Map > floor click!]', data

	# Отслеживание загрузки карты
	createCallback: ->  console.debug '[Map > create!]', this

	initActions: ->

		_self = @

		@el.find('[data-layer]').click ->

			_self.el.find('[data-layer]').not($(@)).removeClass('active')
			_self.el.find('[data-sale]').removeClass('active')

			_self.el.find('.layer.active').hide()

			if $(@).hasClass('active')
				$(@).removeClass('active')

			else

				$(@).addClass('active')
				el = _self.el.find(".layer.active[data-type=#{$(@).attr('data-layer')}][data-shop=#{_self.shop}][data-floor=#{_self.floor}]")
				el.css('display':'block')

				do _self.offAllSale

			return false

		# @el.find('[data-layer]').hover ->
		# 	_self.el.find(".layer[data-type=#{$(@).attr('data-layer')}][data-shop=#{_self.shop}][data-floor=#{_self.floor}]").css('display':'block')
		# ,=>
		# 	_self.el.find(".layer").hide()


		### РАСПРОДАЖА ###

		@el.find('[data-sale]').click ->

			_self.el.find('[data-layer]').removeClass('active')
	
			if $(@).hasClass('active')
				$(@).removeClass('active')

				do _self.offAllSale

			else

				$(@).addClass('active')
				
				findAreas = _.filter _self.areas, (area) -> area.sale is true
				ids = _.pluck(findAreas, 'id')
				_self.getAreasOverlay ids

				_self.el.find('.layer.active').hide()

			false


		# @el.find('[data-sale]').hover ->

		# 	findAreas = _.filter _self.areas, (area) -> area.sale is true
		# 	ids = _.pluck(findAreas, 'id')
		# 	_self.getAreasOverlay ids

		# ,=> do @offAllSale


		### ФИЛЬР ПО ТИПУ МАГАЗИНА ###
		# @el.find('[data-type]').hover ->

		# 	findType = $(@).attr('data-type')
		# 	findAreas = _.filter _self.areas, (area) -> parseInt(area.type) is parseInt(findType)
		# 	ids = _.pluck(findAreas, 'id')
		# 	_self.getAreas ids

		#,=> do @offAllPoly

		@el.find('[data-type]').click ->

			#убираем подсветку в списке магазинов
			_self.el.find('.list li').removeClass 'active'

			$a = $(@).find('a')

			# Разрешем только одному типу подсвечиваться
			_self.el.find('[data-type] a').not($a).removeClass 'active'

			if !$a.hasClass 'active'

				$a.addClass('active')

				findType = $(@).attr('data-type')
				findAreas = _.filter _self.areas, (area) -> parseInt(area.type) is parseInt(findType)
				ids = _.pluck(findAreas, 'id')
				_self.getAreas ids

			else

				$a.removeClass 'active'

				_self.offAllPoly(true)

			false


		### ПОИСК ###
		timeout = null
		@el.find('#findAreaByBrand')
		.keypress((event) ->

			#убираем подсветку в списке магазинов
			_self.el.find('.list li').removeClass 'active'

			if event.keyCode == 13
				event.preventDefault()

				clearTimeout timeout
				_self.findBrandByName $(@).val()

				return false

		).keyup( ->
			clearTimeout timeout
			timeout = setTimeout(=>
				_self.findBrandByName $(@).val()
			,500)
		)

	getAreaCorners: (coords) ->
		coordsArray = coords.split(",")
		center = []

		# For rect and poly areas we need to loop through the coordinates
		coord = undefined
		minX = maxX = parseInt(coordsArray[0], 10)
		minY = maxY = parseInt(coordsArray[1], 10)
		i = 0
		l = coordsArray.length

		while i < l
			coord = parseInt(coordsArray[i], 10)
			if i % 2 is 0 # Even values are X coordinates
				minX = coord  if coord < minX
				maxX = coord  if coord > maxX
			else # Odd values are Y coordinates
				minY = coord  if coord < minY
				maxY = coord  if coord > maxY
			i++

		return [minX, maxX, minY, maxY]

	getAreaCenter: (coords) ->

		coords = @getAreaCorners(coords)

		center = 
			x: parseInt((coords[0] + coords[1])/2, 10)
			y: parseInt((coords[2] + coords[3])/2, 10)

		return center

	createMap: ->

		do @preloaderON

		_self = @

		# Наполняем карту!
		@el.find('.map').html """
			<img class="map-image" usemap="#shop" src="#{@root}images/maps/#{@shop}/#{@floor}.png" width="#{@mapWidth}px" height="#{@mapHeight}px" />
			<map name="shop"></map>
		"""

		# Наполняем map
		areaId = 1
		_.each window.SHAPES, (v,k) ->
			#console.log v.curves
			coordsArr = []
			_.each v.curves[0], (v,k) ->
				coordsArr.push v.x*_self.zoom
				coordsArr.push v.y*_self.zoom
			#console.log coords
			coords = coordsArr.join(',')

			$area = $("<area data-area='#{areaId}' href='#' coords='#{coords}' maphilight='{}' shape='poly' >")

			_self.el.find('.map map').append $area

			areaId++

	
		# Инициализация либы подсветки
		@el.find('.map-image').maphilight
			fade: true
			stroke: true
			strokeOpacity: 1
			strokeColor: @hilightColor
			fillOpacity: 0.6
			fillColor: @hilightColor
			wrapClass: 'map-bg'

		interval = setInterval(=>
			if @el.find('.map-bg').size()
				do @createMapCallback
				clearInterval interval
		,100)

		return
	
	createMapCallback: ->

		_self = @
		
		#Ставим слои на один уровень с картами
		if @showLayers
			@el.find('.map-bg').prepend(@layersEl)
			@layersEl.show()

		if @showIds
			@idsLayer = $("<div class='ids'></div>")
			@el.find('.map-bg').prepend(@idsLayer)

		do @setZoom

		@el.find('.movebox').css(left:0,top:0).draggable()

		@el.find('area').each ->

			areaId = parseInt($(@).attr('data-area'))

			data = $(@).data("maphilight") or {}

			center = _self.getAreaCenter($(@).attr('coords'))

			area 	= _.find _self.areas, (area) -> parseInt(area.id) is areaId

			$(@).click =>

				_self.areaClick(areaId:areaId, area:area, position:center, shop:_self.shop, floor:_self.floor)

				if area and area.url
					window.location.href = area.url

				return false


			$(@).mouseenter (e, fixed) ->

				_self.areaHover(areaId:areaId, area:area, position:center, shop:_self.shop, floor:_self.floor)

				#if !area then console.log {id:id, name:'noname'}

				$('#tooltip-area').remove() # грохаем тултип

				# Грохвем Таскать тултип за курсором мышки
				_self.el.find('.map').unbind 'mousemove'

				# убираем подсветку в списке магазинов
				_self.el.find('.list li').removeClass 'active'

				do _self.offAllPoly

				if area or _self.showIds

					# подсвечиваем пункт в списке магазинов
					_self.el.find(".list li.shop-#{areaId}").addClass 'active'

					center =  _self.getAreaCenter $(@).attr('coords')

					if _self.showIds
						content = areaId
					else
						content = if area.logo then "<img src='#{area.logo}' >" else area.name

					tooltip = """
						<div id="tooltip-area" class="label #{if area.logo then 'withlogo' else ''}">
							<div class="tooltip-wrapper">
								<div class="tooltip-inner">#{content}</div>
							</div>
							<div class="tooltip-corner"></div>
						</div>
					"""

					$tooltip = $(tooltip)

					$tooltip.css
						'top': center.y
						'left': center.x

					_self.el.find('.map-bg').prepend $tooltip

					$(@).addClass 'active'

					# Если фиксированное положение
					if fixed

						if $('#tooltip-area').size()	

							$('#tooltip-area').css
								'top':  center.y
								'left': center.x

					# Если нет то, таскать тултип за курсором мышки
					else

						_self.el.find('.map').unbind('mousemove').mousemove (e) ->

							if $('#tooltip-area').size()							
								top 	= e.pageY - $(this).offset().top - _self.mapPosition.top - 10
								left 	= e.pageX - $(this).offset().left - _self.mapPosition.left
								$('#tooltip-area').css
									'top': top
									'left': left

					# Подсвечиваем полигон
					data = $(this).data("maphilight") or {}

					data.alwaysOn = true

					if _self.showDoneShops and $(@).hasClass 'hold'
						data.fillColor = _self.doneColor
					else
						data.fillColor = _self.hilightColor

					$(this).data("maphilight", data).trigger('alwaysOn.maphilight')

			
			.mouseleave (e) ->

				if !$(@).hasClass 'hold'

					# убираем подсветку в списке магазинов
					_self.el.find('.list li').removeClass 'active'
				
					data = $(this).data("maphilight") or {}

					data.fillColor = _self.hilightColor

					data.alwaysOn = false
					$(this).data("maphilight", data).trigger('alwaysOn.maphilight').removeClass 'active'

				$('#tooltip-area').remove() # грохаем тултип

				# Грохаем Таскать тултип за курсором мышки
				_self.el.find('.map').unbind 'mousemove'

			### показывать айдишники на полигонах ###
			if _self.showIds

				$boxidEl = $("<div class='boxid' style='position:absolute; font-size: #{_self.boxidSize}; color: #{_self.boxidColor};'>#{$(@).attr('data-area')}</div>")
				_self.idsLayer.append $boxidEl
				$boxidEl.css
					'top': center.y - $boxidEl.height()/2
					'left':center.x - $boxidEl.width()/2

			### Заполненные магазины ###
			if area and _self.showDoneShops

				data.fillColor = _self.doneColor
				data.alwaysOn = true
				$(@).addClass 'active hold'
				$(@).data("maphilight", data).trigger('alwaysOn.maphilight')

		if @shopid
			@getArea(@shopid)
			@el.find(".map map area[data-area='#{@shopid}']").trigger('mouseenter', true)

		#@getAreas([1,26])
		#@findBrandByName('кефир')

		do @preloaderOFF

		do @createCallback

	showDone: ->

		_self = @

		@el.find('area').each ->

			areaId = parseInt($(@).attr('data-area'))
			data = $(@).data("maphilight") or {}
			area 	= _.find _self.areas, (area) -> parseInt(area.id) is areaId

			### Заполненные магазины ###
			if area and _self.showDoneShops
				data.fillColor = _self.doneColor
				data.alwaysOn = true
				$(@).addClass 'active hold'
				$(@).data("maphilight", data).trigger('alwaysOn.maphilight')

	findBrandByName: (name) ->

		do @offAllPoly

		area 	= _.find @areas, (area) -> area.name.toLowerCase() is name.toLowerCase()

		console.log "[Map > findBrandByName] '#{name}' - ", area

		if area

			@getArea area.id

	#возвращем всем полигонам прежнюю окраску	
	offAllPoly: (withHold) ->

		_self = @

		if withHold
			$('area.hold').removeClass 'hold'

		$('area.active').each ->

			if !$(@).hasClass 'hold' 

				data = $(this).data("maphilight") or {}
				data.strokeColor = _self.hilightColor
				data.fillColor = _self.hilightColor
				data.alwaysOn = false
				
				$(this).data("maphilight", data).trigger('alwaysOn.maphilight').removeClass 'active'

	getAreasOverlay: (ids) ->

		_.each ids, (id) =>

			$area = $("area[data-area='#{id}']")

			area 	= _.find @areas, (area) -> parseInt(area.id) is parseInt(id)

			#if !area then console.log {id:id, name:'noname'}

			if $area.size() and area

				console.log "[Map > getAreasOverlay]", area

				tooltip = """
					<div class="tooltip-sale" style="
						position:absolute;
						/*background:red;*/
						background: url('#{@root}images/sale_filter.png') no-repeat;
						background-size: 100%;						
					">
					</div>
				"""

				center = @getAreaCenter($area.attr('coords'))

				$tooltip = $(tooltip)

				$tooltip.css
					width: 25
					height: 25
					'top': center.y - 25 / 2
					'left': center.x - 25 / 2

				$area.after $tooltip

	offAllSale: ->

		@el.find('.tooltip-sale').remove()

	getAreas: (ids) ->

		@offAllPoly(true)

		_.each ids, (id) =>

			$area = $("area[data-area='#{id}']")

			area 	= _.find @areas, (area) -> parseInt(area.id) is parseInt(id)

			#if !area then console.log {id:id, name:'noname'}

			if $area.size() and area

				console.log '[Map > getAreas]', area

				$area.addClass 'active'

				data = $area.data("maphilight") or {}

				#определяем цвет покраски, в завиисмости от типа
				color = @areaColors[area.type] || false
					
				if $area.hasClass 'hold'

					data.fillColor = @hilightColor
					data.strokeColor = @hilightColor
					data.alwaysOn = false
					$area.removeClass 'hold'

				else if color

					data.fillColor = color
					data.strokeColor = color
					data.alwaysOn = true
					$area.addClass 'hold'

				$area.data("maphilight", data).trigger('alwaysOn.maphilight')

	getArea: (id,hold) ->

		$area = $("area[data-area='#{id}']")

		area 	= _.find @areas, (area) -> parseInt(area.id) is parseInt(id)

		#if !area then console.log {id:id, name:'noname'}

		if $area.size() and area

			if hold then $area.addClass 'hold'

			@offAllPoly()

			# подсвечиваем пункт в меню
			@el.find('.list li').removeClass 'active'
			@.el.find(".list li.shop-#{id}").addClass 'active'

			# грохаем тултип		
			$('#tooltip-area').remove() 

			console.log '[Map > getArea]', area

			$area.addClass 'active'

			data = $area.data("maphilight") or {}
			data.fillColor = if @showDoneShops then @doneColor else @hilightColor
			data.alwaysOn = true
			$area.data("maphilight", data).trigger('alwaysOn.maphilight')

	initMap: (data) ->

		_data =
			areas: []
			

		if !@floor and @floor isnt 0 then @floor = @floors[@shop][0]

		_.each data, (v) =>
			if parseInt(v.floor) is parseInt(@floor)
				_data.areas = v.areas

		@areas  = _data.areas
		@floors = _data.floors if _data.floors
		@layers = _data.layers if _data.layers

		# Наполняем ссылки этажей
		$floors = @el.find('.nav')

		$floors.empty()

		_.each @floors[@shop], (v,k) =>
			$floors.append """
				<li class="floor" data-floor="#{v}" onclick="map.getMap('#{@shop}',#{v});"><a href="#tabs-#{v}">#{v} этаж</a></li>
			"""

		# Посдвечиваем ссылки этажей
		$floors.find('.floor').removeClass 'active'
		$floors.find(".floor[data-floor='#{@floor}']").addClass 'ui-tabs-active'

		# Наполняем меню - оглавление
		$list = @el.find('.list')

		$list.empty()
		_.each @areas, (v,k) =>
			$list.append """
				<li class="shop-#{v.id}" onclick="map.offAllPoly(true); map.getArea(#{v.id},true)">#{v.name} [id:#{v.id}]</li>
			"""

		# Наполняем слои
		if @showLayers

			@el.find('[data-layer]').removeClass('active').parent().hide()
		
			_.each @layers[@shop][@floor], (type) =>

				layer = """
					<img class="layer" data-shop="#{@shop}" data-floor="#{@floor}" data-type="#{type}" src="#{@root}images/maps/#{@shop}/#{type}_#{@floor}.png" style="position:absolute;display:block;">
					<img class="layer active" data-shop="#{@shop}" data-floor="#{@floor}" data-type="#{type}" src="#{@root}images/maps/#{@shop}/#{type}_#{@floor}_active.png" style="position:absolute;display:none;">
				"""

				@layersEl.append $(layer)
		
				@el.find("[data-layer='#{type}']").parent().show()

		# Sale
		@el.find('[data-sale]').removeClass('active').parent().hide()
		@el.find('[data-sale]').parent().show() if _.find @areas, (area) -> area.sale is true


		#console.debug "[GET MAP]  ТЦ #{@shop}","| Этаж: '#{@floor}'","| Всего этажей:",@floors,"| Всего магазинов:",@areas

		# Дерагаем нужную карту
		urljs =  "#{@root}js/maps/#{@shop}/#{@floor}.js"

		console.debug "[Map > getScript]", urljs

		$.getScript urljs, =>

			do @createMap
		
			false
	
	getMap: (@shop,@floor,@shopid) ->

		do @preloaderON

		@zoom = @zoomMin #reset zoom!

		if @showLayers
			
			if @el.find(".layers").size()
				@layersEl = @el.find(".layers")
			else
				@layersEl =  $("<div class='layers'></div>")
				@el.append @layersEl

		@el.find('.map').empty()

		@apiUrl += '?shop=' +  @shop

		$.getJSON(@apiUrl)
		.done((data) =>
			#data = $.parseJSON(data)
			console.debug "[Map > getJSON from server]", @apiUrl, "done ->", data
			@initMap data
		)

