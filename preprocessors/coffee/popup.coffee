###
Примеры вызова попапа

1. popup.open('popup_name')
2. popup.custom('title','body')
3. popup.custom('Ошибка','Необходима авторизация',{button: function(){popup.open('popup_name')}});
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

      @el         = $("#popups")
      @bg         = @el.find(".background")
      @elClose    = @el.find("[data-popup-close]")
      @popupsAll  = @el.find("[data-popup-name]")
      @popups   = if @group isnt ""
          @el.find("[data-popup-group='#{@group}'][data-popup-name]")
        else
          @popupsAll


      @elClose.click =>
        @disable()
        false

      $(document).keypress (e) =>
        @disable() if e.keyCode is 27 and @status is 1

      $(window).scroll => @center() if @status is 1

      $(window).resize => @center() if @status is 1

  ### Список всех попапов ###
  list: ->
    @popups.each ->
      console.log 'Popup', $(@).data()



  load: (popup,callback) ->

    if @status is 0
      @doCallback popup
      @popups.hide().removeClass 'open'
      popup.css width: popup.width() + parseInt(popup.css("paddingLeft")) + parseInt(popup.css("paddingRight")) + parseInt(popup.css("border-right-width")) + parseInt(popup.css("border-right-width"))
      popup.addClass 'open'
      
      if @fade
        popup.fadeIn @fade, =>
          callback() if callback
          @loadCallback popup
       
      else
        popup.show()
        callback() if callback
        @loadCallback popup
       

      @bg.show()
      @status = 1


  ### Если надо отловить callback ДО открытия попапа: ###
  doCallback: (popup) ->

  ### Если надо отловить callback после появления попапа:
  popup.loadCallback = function(popup){
    console.log('this loadCallback. and this popup:',popup);
  }
  ###

  loadCallback: (popup) ->

  disable: ->
    if @status is 1
      @popupsAll.removeClass 'open'
      if @fade
        @popupsAll.fadeOut(@fade)
      else
        @popupsAll.hide()
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

  ### Функция открытия конкретного попапа
  popup.open('unique',{button: function(){popup.close()}});
  opt = {
    button: bool or function. Если надо навешать функцию на кнопку. При этом у кнопки должен быть обязательный атрибут [data-popup-button]
    closeDisable: bool Если надо блокировать закрытие
    callback: function
  }
  ###
  open: (name, opt={}) ->

    @close()

    popup = $("[data-popup-name='#{name}']")

    if !popup.size() then return console.warn "popup #{name} not found"

    @center popup
    @load popup, opt.callback ? false

    $button = popup.find("[data-popup-button]")

    if opt.button and $button.size()
      $button.unbind("click").click =>
        if typeof button is "function"
          opt.button()
        else
          @close()

    if opt.closeDisable
      @status = 0


  ### Функция открытия конкретного попапа  
  кастомный попап для вывода любой	информации
  popup.custom('Ошибка','Необходима авторизация',{button: function(){popup.open('popup_name')}});
  ###
  custom: (title, text, opt={}) ->

    name = "custom"

    popup = $("[data-popup-name='#{name}']")

    if !popup.size() then return console.warn "popup #{name} not found"
   
    popup.find(".header h1").html title
    popup.find(".body").html text
  
    @open name, opt


### ============ Объявляем Попапы! =========== ###

window.popup = new Popup


window.popup2 = new Popup
  group: 'group_name'
  top: 50
  left: 150
  scroll: false