
/* Router */
var Router,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }


  /* маршруты */

  Router.prototype.routes = {
    "": "index",
    "/": "index",
    "page/:id": "page",
    "page/:id/": "page",
    "ooops": "ooops",
    "ooops/": "ooops",
    "*path": "notFound"
  };


  /* инициализация */

  Router.prototype.initialize = function() {
    return this.bind("all", function(route, router) {});
  };


  /* до перехода */

  Router.prototype.before = function(route) {
    this.route = route === "" ? "empty" : route;
    app.debugBox.log('route:' + this.route);
    console.debug('[Route]', this.route);
    return this.hide();
  };


  /* после перехода */

  Router.prototype.after = function(route) {};

  Router.prototype.hide = function() {
    return $('body > main > .sections > section').removeClass('current').hide();
  };

  Router.prototype.show = function(el) {
    this.hide();
    return el.addClass('current').show();
  };

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


  /*  404 страница */

  Router.prototype.notFound = function(path) {
    var el;
    el = $('section#notFound');
    this.scrollTop();
    return this.show(el);
  };


  /* Серверная ошибка */

  Router.prototype.ooops = function() {
    var el;
    el = $('section#ooops');
    this.scrollTop();
    return this.show(el);
  };

  Router.prototype.index = function() {
    var el;
    el = $('section#index');
    this.scrollTop();
    return this.show(el);
  };

  Router.prototype.page = function(id) {
    var el;
    el = $('section#page');
    this.scrollTop();
    return this.show(el);
  };

  return Router;

})(Backbone.Router);
