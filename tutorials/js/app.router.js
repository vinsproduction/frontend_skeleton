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
    "!/helpers-images": "helpers-images",
    "!/helpers-images/": "helpers-images",
    "!/popup": "popup",
    "!/popup/": "popup",
    "!/render": "render",
    "!/render/": "render",
    "!/ooops": "ooops",
    "!/ooops/": "ooops",
    "*path": "notFound"
  };

  /* инициализация*/


  Router.prototype.initialize = function() {
    return this.bind("all", function(route, router) {});
  };

  /* до перехода*/


  Router.prototype.before = function(route) {
    if (route !== '') {
      console.debug('[Route]', route);
    }
    return $('section').hide();
  };

  /* после перехода*/


  Router.prototype.after = function() {};

  Router.prototype.scrollTop = function(speed) {
    if (speed == null) {
      speed = 400;
    }
    if (speed) {
      return $('html,body').animate({
        scrollTop: 0
      }, speed);
    } else {
      return $('body').scrollTop(0);
    }
  };

  Router.prototype.resize = function(el) {};

  /*  404 страница*/


  Router.prototype.notFound = function(path) {
    var el;
    el = $('section#notFound');
    this.scrollTop();
    return el.show();
  };

  /* Серверная ошибка*/


  Router.prototype.ooops = function() {
    var el;
    el = $('section#notFound');
    this.scrollTop();
    return el.show();
  };

  Router.prototype.index = function() {
    var el;
    el = $('section#index');
    this.scrollTop();
    return el.show();
  };

  Router.prototype["popup"] = function() {
    var el;
    el = $('section#page-popup');
    this.scrollTop();
    return el.show();
  };

  Router.prototype["render"] = function() {
    var el;
    el = $('section#page-render');
    this.scrollTop();
    return el.show();
  };

  Router.prototype["helpers-images"] = function() {
    var el;
    el = $('section#page-helpers-images');
    this.scrollTop();
    return el.show();
  };

  return Router;

})(Backbone.Router);
