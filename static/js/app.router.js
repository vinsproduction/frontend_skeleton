
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
    "!": "index",
    "!index": "index",
    "!page": "page",
    "!page/": "page",
    "!page/:id": "page",
    "!page/:id/": "page",
    "!ooops": "ooops",
    "!ooops/": "ooops",
    "*path": "notFound"
  };


  /* инициализация */

  Router.prototype.initialize = function() {
    return this.bind("all", function(route, router) {});
  };


  /* до перехода */

  Router.prototype.before = function(route) {
    if (route === "") {
      this.route = "empty";
    } else {
      this.route = route;
    }
    if (app.debugBox.state) {
      app.debugBox.log("route", this.route);
    }
    console.debug('[App > router]', 'route:', this.route);
    return this.hide();
  };


  /* после перехода */

  Router.prototype.after = function(route) {};

  Router.prototype.hide = function() {
    return $('body > main > .sections > section').removeClass('current').hide();
  };

  Router.prototype.show = function() {
    this.hide();
    return this.el.addClass('current').show();
  };

  Router.prototype.scrollTop = function(speed) {
    return app.scroll(0, speed);
  };


  /*  404 страница */

  Router.prototype.notFound = function(path) {
    this.el = $('section#notFound');
    this.scrollTop();
    this.show();
    console.error("[App > router] route " + path + " not found");
    if (app.debugBox.state) {
      return app.debugBox.log("route", "not found");
    }
  };


  /* Серверная ошибка */

  Router.prototype.ooops = function() {
    this.el = $('section#ooops');
    this.scrollTop();
    return this.show();
  };

  Router.prototype.index = function() {
    this.el = $('section#index');
    this.scrollTop();
    return this.show();
  };

  Router.prototype.page = function(id) {
    this.el = $('section#page');
    this.scrollTop();
    return this.show();
  };

  return Router;

})(Backbone.Router);
