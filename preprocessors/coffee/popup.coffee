###
Примеры вызова попапа

1. popup.open('popup_name')
2. popup.custom('title','body')
3. popup.custom('Необходимо авторизоваться', function() { popup.open('popup_name'); });
    при этом у кнопки должен быть обязательный атрибут [data-popup-button]
###

class Popup

  ### плавное открыватие попапа ###
  fade: 500 #or false 

  ### Автоматическое и ручное позицонирование попапа ###
  top:  'auto'
  left: 'auto'

  ### Автоматическое движение попапа за скроллом ###
  scroll: true

  ### Вызов и закрытие определенной группы попапов 
  Если необходимо отделить одни попапы от других, то в конструктор передается пераметр group
  window.popup2 = new Popup({group: 'type-2'})
  И соответсвенно запускаем их через popup2.open('popup_name')
  !!! Обязатльное условие, у попапов с группой должен быть обязательный атрибут [data-popup-group]
  ###
  group: ""

  constructor: (opt={}) ->


    @status = 0

    if opt.scroll?
      @scroll = opt.scroll
    if opt.group
      @group = opt.group
    if opt.top
      @top = opt.top
    if opt.left
      @left = opt.left
     
      
    $ =>

      @el       = $("#popups")
      @bg       = @el.find(".background")
      @elClose  = @el.find("[data-popup-close]")
      @popups   = if @group isnt ""
          @el.find("[data-popup-group='#{@group}'][data-popup-name]")
        else
          @el.find("[data-popup-name]")


      @elClose.click =>
        @disable()
        false

      $(document).keypress (e) =>
        @disable() if e.keyCode is 27 and @status is 1

      $(window).scroll => @center() if @status is 1

      $(window).resize => @center() if @status is 1

  list: ->
    @popups.each ->
      console.log 'Popup', $(@).data()

  load: (popup) ->
    if @status is 0
      @popups.hide().removeClass 'open'
      popup.css width: popup.width() + parseInt(popup.css("paddingLeft")) + parseInt(popup.css("paddingRight")) + parseInt(popup.css("border-right-width")) + parseInt(popup.css("border-right-width"))
      popup.addClass 'open'  
      if @fade
        popup.fadeIn(@fade)
      else
        popup.show()

      @bg.show()
      
      @status = 1

  disable: ->
    if @status is 1

      @popups.removeClass 'open'

      if @fade
        @popups.fadeOut(@fade)
      else
        @popups.hide()

      @bg.hide()

      @status = 0

  close: ->
    @status = 1
    @disable()

  center: (popup) ->

    if !popup
      popup = if @group isnt ""
          @el.find(".open[data-popup-group='#{@group}'][data-popup-name]")
        else
          @el.find(".open[data-popup-name]")

    if !popup.size() then return console.error "popup not found"

    windowWidth = document.documentElement.clientWidth
    windowHeight = document.documentElement.clientHeight
    popupHeight = popup.height() + parseInt(popup.css("paddingTop")) + parseInt(popup.css("paddingBottom"))
    popupWidth = popup.width() + parseInt(popup.css("paddingLeft")) + parseInt(popup.css("paddingRight"))
    windowScroll = $(window).scrollTop()
    t = windowHeight / 2 - popupHeight / 2 + windowScroll
    t = 0  if t < 0
    l = $(window).width() / 2 - popupWidth / 2

    popup.css
      top: if @top is 'auto' then t else @top
      left: if @left is 'auto' then l else @left

    if @scroll and @top then popup.css(top:@top+windowScroll)


  # Функиця открытия конкретного попапа
  # closeDisable -- true, если надо блокировать закрытие
  open: (name, button, closeDisable, callback) ->

    popup = $("[data-popup-name='#{name}']")

    if !popup.size() then return console.error "popup #{name} not found"

    @center(popup)
    @load(popup)

    $button = popup.find("[data-popup-button]")

    if button and $button.size()
      $button.unbind("click").click =>
        if typeof button is "function"
          button()
        else
          @close()
        false

    if closeDisable
      @status = 0

    callback() if callback

    
  # кастомный попап для вывода любой	информации
  # button -- передается функция пост обработки нажатия или bool
  # Например: popup.custom('Необходимо авторизоваться', function() { popup.open('popup_name'); });
  custom: (title, text, button, callback, closeDisable) ->

    name = "custom"

    popup = $("[data-popup-name='#{name}']")

    if !popup.size() then return console.error "popup #{name} not found"
   
    popup.find(".header h1").html title
    popup.find(".body").html text
  
    @open name, button, callback, closeDisable


### ============ Объявляем Попапы! =========== ###

window.popup = new Popup


window.popup2 = new Popup
  group: 'group_name'
  top: 50
  left: 150
  scroll: false