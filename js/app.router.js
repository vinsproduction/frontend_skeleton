/* Router*/

var Router, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /* маршруты*/


  Router.prototype.routes = {
    "": "index",
    "!": "index",
    "!/": "index",
    "!/page/:id": "page",
    "!/page/:id/": "page",
    "!/ooops": "ooops",
    "!/ooops/": "ooops",
    "*path": "notFound"
  };

  /* инициализация*/


  Router.prototype.initialize = function() {
    var _this = this;
    this.bind("all", function(route, router) {});
    if (typeof VK !== "undefined" && VK !== null) {
      return VK.init(function() {
        /* следить за изменениями хеша вконтакте*/

        VK.addCallback('onLocationChanged', function(location) {
          console.debug('[VKONTAKTE > onLocationChanged]', location);
          return app.redirect(location.replace("!", ""));
        });
        /* следить за скроллом*/

        VK.callMethod('scrollSubscribe', true);
        /* событие после скролла*/

        return VK.addCallback('onScroll', function(scroll, heigh) {
          return console.log('[VKONTAKTE > onScroll]', scroll, heigh);
        });
      });
    }
  };

  /* до перехода*/


  Router.prototype.before = function(route) {
    if (route !== '') {
      console.debug('[Route]', route);
    }
    if (typeof VK !== "undefined" && VK !== null) {
      /* выставить хеш*/

      return VK.callMethod('setLocation', route);
    }
  };

  /* после перехода*/


  Router.prototype.after = function() {};

  Router.prototype.scrollTop = function(speed) {
    if (speed == null) {
      speed = 400;
    }
    if (speed) {
      $('html,body').animate({
        scrollTop: 0
      }, speed);
      if (typeof VK !== "undefined" && VK !== null) {
        return VK.callMethod('scrollWindow', 0, speed);
      }
    } else {
      $('body').scrollTop(0);
      if (typeof VK !== "undefined" && VK !== null) {
        return VK.callMethod('scrollWindow', 0);
      }
    }
  };

  Router.prototype.resize = function(el) {
    if (typeof VK !== "undefined" && VK !== null) {
      /* ресайз окна Вконтакте*/

      return window.onload = function() {
        return setTimeout(function() {
          var diff, elH, h;
          diff = 530;
          elH = $(el).height();
          h = elH + diff;
          console.debug("[VKONTAKTE > resizeWindow] '" + el + "' height:", h, '| elHeight:', elH, '| diff:', diff);
          return VK.callMethod("resizeWindow", 1000, h);
        }, 1000);
      };
    }
  };

  /*  404 страница*/


  Router.prototype.notFound = function(path) {
    var el;
    el = $('section#notFound');
    this.scrollTop();
    el.show();
    return this.resize(el);
  };

  /* Серверная ошибка*/


  Router.prototype.ooops = function() {
    var el;
    el = $('section#notFound');
    this.scrollTop();
    el.show();
    return this.resize(el);
  };

  Router.prototype.index = function() {
    var el;
    el = $('section#index');
    this.scrollTop();
    el.show();
    return this.resize(el);
  };

  Router.prototype.page = function(id) {
    var el;
    el = $('section#page');
    this.scrollTop();
    el.show();
    return this.resize(el);
  };

  return Router;

})(Backbone.Router);
