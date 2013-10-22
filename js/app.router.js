var AppRouter, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone.Router.prototype.before = function() {};

Backbone.Router.prototype.after = function() {};

Backbone.Router.prototype.route = function(route, name, callback) {
  var router;
  if (!_.isRegExp(route)) {
    route = this._routeToRegExp(route);
  }
  if (_.isFunction(name)) {
    callback = name;
    name = "";
  }
  if (!callback) {
    callback = this[name];
  }
  router = this;
  return Backbone.history.route(route, function(fragment) {
    var args;
    args = router._extractParameters(route, fragment);
    router.before.apply(router, arguments);
    callback && callback.apply(router, args);
    router.after.apply(router, arguments);
    router.trigger.apply(router, ["route:" + name].concat(args));
    router.trigger("route", name, args);
    return Backbone.history.trigger("route", router, name, args);
  });
};

AppRouter = (function(_super) {
  __extends(AppRouter, _super);

  function AppRouter() {
    _ref = AppRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppRouter.prototype.routes = {
    "": "index",
    "!": "index",
    "!/": "index",
    "!/ooops": "ooops",
    "!/ooops/": "ooops",
    "!/ie": "ie",
    "!/ie/": "ie",
    "*path": "notFound"
  };

  AppRouter.prototype.before = function(route) {
    if (route !== '') {
      console.debug('[Route]', route);
    }
    return $('body').scrollTop(0);
  };

  AppRouter.prototype.after = function() {};

  AppRouter.prototype.initialize = function() {
    return this.bind("all", function(route, router) {});
  };

  AppRouter.prototype.changeBg = function(className) {
    if (className == null) {
      className = "";
    }
    $('.background').removeClass('bg-1');
    if (className !== "") {
      return $('.background').addClass(className);
    }
  };

  AppRouter.prototype.notFound = function(path) {};

  AppRouter.prototype.ooops = function() {};

  AppRouter.prototype.ie = function() {};

  AppRouter.prototype.index = function() {};

  return AppRouter;

})(Backbone.Router);
