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
    "!/profile": "profile",
    "!/profile/": "profile",
    "!/profile/:uid": "profile",
    "!/profile/:uid/": "profile",
    "!/profile/:uid/:action": "profile",
    "!/profile/:uid/:action/": "profile",
    "!/profile/:uid/:action/:sid": "profile",
    "!/profile/:uid/:action/:sid/": "profile",
    "!/story/:id": "storyView",
    "!/story/:id/": "storyView",
    "!/ooops": "ooops",
    "!/ooops/": "ooops",
    "!/ie": "ie",
    "!/ie/": "ie",
    "*path": "notFound"
  };

  AppRouter.prototype.before = function(route) {
    console.debug('[Route]', route);
    $('body').scrollTop(0);
    $('section').hide();
    return $("section#menu a").removeClass('active');
  };

  AppRouter.prototype.after = function() {};

  AppRouter.prototype.initialize = function() {
    return this.bind("all", function(route, router) {});
  };

  AppRouter.prototype.changeBg = function(className) {
    if (className == null) {
      className = "";
    }
    $('.background').removeClass('bg-1').removeClass('bg-2').removeClass('bg-3');
    if (className !== "") {
      return $('.background').addClass(className);
    }
  };

  AppRouter.prototype.notFound = function(path) {
    if (path === '_=_') {
      app.redirect();
      return;
    }
    $('section#notFound').show();
    return this.changeBg('bg-1');
  };

  AppRouter.prototype.ooops = function() {
    $("section").hide();
    $('section#ooops').show();
    return this.changeBg('bg-1');
  };

  AppRouter.prototype.ie = function() {
    $("section").hide();
    $('section#ie').show();
    return this.changeBg('bg-1');
  };

  AppRouter.prototype.index = function() {
    $("section").hide();
    $('section#articles').show();
    this.changeBg();
    return app.views.articles.controller();
  };

  return AppRouter;

})(Backbone.Router);
