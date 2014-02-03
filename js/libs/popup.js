/*
Примеры вызова попапа

1. popup.open('popup_name')
2. popup.custom('title','body')
3. popup.custom('Ошибка','Необходима авторизация',{button: function(){popup.open('popup_name')}});
    при этом у кнопки должен быть обязательный атрибут [data-popup-button]
*/

var Popup;

Popup = (function() {
  /* плавное открыватие попапа*/

  Popup.prototype.fade = 500;

  /* Автоматическое и ручное позицонирование попапа*/


  Popup.prototype.top = 'auto';

  Popup.prototype.left = 'auto';

  /* Автоматическое движение попапа за скроллом*/


  Popup.prototype.scroll = true;

  /* Вызов и закрытие определенной группы попапов 
  Если необходимо отделить одни попапы от других, то в конструктор передается пераметр group
  window.popup2 = new Popup({group: 'type-2'})
  И соответсвенно запускаем их через popup2.open('popup_name')
  !!! Обязатльное условие, у попапов с группой должен быть обязательный атрибут [data-popup-group]
  */


  Popup.prototype.group = "";

  function Popup(opt) {
    var _this = this;
    if (opt == null) {
      opt = {};
    }
    this.status = 0;
    if (opt.scroll != null) {
      this.scroll = opt.scroll;
    }
    if (opt.group) {
      this.group = opt.group;
    }
    if (opt.top) {
      this.top = opt.top;
    }
    if (opt.left) {
      this.left = opt.left;
    }
    $(function() {
      _this.el = $("#popups");
      _this.bg = _this.el.find(".background");
      _this.elClose = _this.el.find("[data-popup-close]");
      _this.popupsAll = _this.el.find("[data-popup-name]");
      _this.popups = _this.group !== "" ? _this.el.find("[data-popup-group='" + _this.group + "'][data-popup-name]") : _this.popupsAll;
      _this.elClose.click(function() {
        _this.disable();
        return false;
      });
      $(document).keypress(function(e) {
        if (e.keyCode === 27 && _this.status === 1) {
          return _this.disable();
        }
      });
      $(window).scroll(function() {
        if (_this.status === 1) {
          return _this.center();
        }
      });
      return $(window).resize(function() {
        if (_this.status === 1) {
          return _this.center();
        }
      });
    });
  }

  /* Список всех попапов*/


  Popup.prototype.list = function() {
    return this.popups.each(function() {
      return console.log('Popup', $(this).data());
    });
  };

  Popup.prototype.load = function(popup, callback) {
    var _this = this;
    if (this.status === 0) {
      this.doCallback(popup);
      this.popups.hide().removeClass('open');
      popup.css({
        width: popup.width() + parseInt(popup.css("paddingLeft")) + parseInt(popup.css("paddingRight")) + parseInt(popup.css("border-right-width")) + parseInt(popup.css("border-right-width"))
      });
      popup.addClass('open');
      if (this.fade) {
        popup.fadeIn(this.fade, function() {
          if (callback) {
            callback();
          }
          return _this.loadCallback(popup);
        });
      } else {
        popup.show();
        if (callback) {
          callback();
        }
        this.loadCallback(popup);
      }
      this.bg.show();
      return this.status = 1;
    }
  };

  /* Если надо отловить callback ДО открытия попапа:*/


  Popup.prototype.doCallback = function(popup) {};

  /* Если надо отловить callback после появления попапа:
  popup.loadCallback = function(popup){
    console.log('this loadCallback. and this popup:',popup);
  }
  */


  Popup.prototype.loadCallback = function(popup) {};

  Popup.prototype.disable = function() {
    if (this.status === 1) {
      this.popupsAll.removeClass('open');
      if (this.fade) {
        this.popupsAll.fadeOut(this.fade);
      } else {
        this.popupsAll.hide();
      }
      this.bg.hide();
      return this.status = 0;
    }
  };

  Popup.prototype.close = function() {
    this.status = 1;
    return this.disable();
  };

  Popup.prototype.center = function(popup) {
    var l, popupHeight, popupWidth, t, windowHeight, windowScroll, windowWidth;
    if (!popup) {
      popup = this.group !== "" ? this.el.find(".open[data-popup-group='" + this.group + "'][data-popup-name]") : this.el.find(".open[data-popup-name]");
    }
    if (!popup.size()) {
      return console.error("popup not found");
    }
    windowWidth = document.documentElement.clientWidth;
    windowHeight = document.documentElement.clientHeight;
    popupHeight = popup.height() + parseInt(popup.css("paddingTop")) + parseInt(popup.css("paddingBottom"));
    popupWidth = popup.width() + parseInt(popup.css("paddingLeft")) + parseInt(popup.css("paddingRight"));
    windowScroll = $(window).scrollTop();
    t = windowHeight / 2 - popupHeight / 2 + windowScroll;
    if (t < 0) {
      t = 0;
    }
    l = $(window).width() / 2 - popupWidth / 2;
    popup.css({
      top: this.top === 'auto' ? t : this.top,
      left: this.left === 'auto' ? l : this.left
    });
    if (this.scroll && this.top) {
      return popup.css({
        top: this.top + windowScroll
      });
    }
  };

  /* Функция открытия конкретного попапа
  popup.open('unique',{button: function(){popup.close()}});
  opt = {
    button: bool or function. Если надо навешать функцию на кнопку. При этом у кнопки должен быть обязательный атрибут [data-popup-button]
    closeDisable: bool Если надо блокировать закрытие
    callback: function
  }
  */


  Popup.prototype.open = function(name, opt) {
    var $button, popup, _ref,
      _this = this;
    if (opt == null) {
      opt = {};
    }
    this.close();
    popup = $("[data-popup-name='" + name + "']");
    if (!popup.size()) {
      return console.warn("popup " + name + " not found");
    }
    this.center(popup);
    this.load(popup, (_ref = opt.callback) != null ? _ref : false);
    $button = popup.find("[data-popup-button]");
    if (opt.button && $button.size()) {
      $button.unbind("click").click(function() {
        if (typeof button === "function") {
          return opt.button();
        } else {
          return _this.close();
        }
      });
    }
    if (opt.closeDisable) {
      return this.status = 0;
    }
  };

  /* Функция открытия конкретного попапа  
  кастомный попап для вывода любой	информации
  popup.custom('Ошибка','Необходима авторизация',{button: function(){popup.open('popup_name')}});
  */


  Popup.prototype.custom = function(title, text, opt) {
    var name, popup;
    if (opt == null) {
      opt = {};
    }
    name = "custom";
    popup = $("[data-popup-name='" + name + "']");
    if (!popup.size()) {
      return console.warn("popup " + name + " not found");
    }
    popup.find(".header h1").html(title);
    popup.find(".body").html(text);
    return this.open(name, opt);
  };

  return Popup;

})();

/* ============ Объявляем Попапы! ===========*/


window.popup = new Popup;

window.popup2 = new Popup({
  group: 'group_name',
  top: 50,
  left: 150,
  scroll: false
});
