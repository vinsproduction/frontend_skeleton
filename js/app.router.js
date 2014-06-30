
/* Router */
var indexHashRouter, indexScrollRouter,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

indexHashRouter = (function(_super) {
  __extends(indexHashRouter, _super);

  function indexHashRouter() {
    return indexHashRouter.__super__.constructor.apply(this, arguments);
  }


  /* маршруты */

  indexHashRouter.prototype.routes = {
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

  indexHashRouter.prototype.initialize = function() {
    return this.bind("all", function(route, router) {});
  };


  /* до перехода */

  indexHashRouter.prototype.before = function(route) {
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

  indexHashRouter.prototype.after = function(route) {};

  indexHashRouter.prototype.hide = function() {
    return $('body > main > .sections > section').removeClass('current').hide();
  };

  indexHashRouter.prototype.show = function() {
    this.hide();
    return this.el.addClass('current').show();
  };

  indexHashRouter.prototype.scrollTop = function(speed) {
    return app.scroll(0, speed);
  };


  /*  404 страница */

  indexHashRouter.prototype.notFound = function(path) {
    this.el = $('section#notFound');
    this.scrollTop();
    this.show();
    console.error("[App > router] route " + path + " not found");
    if (app.debugBox.state) {
      return app.debugBox.log("route", "not found");
    }
  };


  /* Серверная ошибка */

  indexHashRouter.prototype.ooops = function() {
    this.el = $('section#ooops');
    this.scrollTop();
    return this.show();
  };

  indexHashRouter.prototype.index = function() {
    this.el = $('section[data-page="index"]');
    this.scrollTop();
    return this.show();
  };

  indexHashRouter.prototype.page = function(id) {
    this.el = $('section[data-page="page"]');
    this.scrollTop();
    return this.show();
  };

  return indexHashRouter;

})(Backbone.Router);

indexScrollRouter = (function(_super) {
  __extends(indexScrollRouter, _super);

  function indexScrollRouter() {
    return indexScrollRouter.__super__.constructor.apply(this, arguments);
  }


  /* маршруты */

  indexScrollRouter.prototype.routes = {
    "": "index",
    "!": "index",
    "!index": "index",
    "!page": "page",
    "!page/": "page",
    "!page/:id": "page",
    "!page/:id/": "page",
    "*path": "notFound"
  };


  /* инициализация */

  indexScrollRouter.prototype.initialize = function() {
    this.bind("all", function(route, router) {});
    return setTimeout((function(_this) {
      return function() {
        var sections;
        sections = [];
        app.views.all.section.each(function() {
          return sections.push({
            name: $(this).attr('data-page'),
            top: $(this).position().top
          });
        });
        sections.reverse();
        console.log('[App > View::indexScrollRouter > set sections]', sections);
        return app.onScroll(function(vars) {
          var find, section;
          find = _.find(sections, function(el) {
            return vars.top > el.top - 10;
          });
          section = find ? find.name : 'none';
          return _this.navigate('!' + section);
        });
      };
    })(this), 700);
  };


  /* до перехода */

  indexScrollRouter.prototype.before = function(route) {
    if (route === "") {
      this.route = "empty";
    } else {
      this.route = route;
    }
    if (app.debugBox.state) {
      app.debugBox.log("route", this.route);
    }
    return console.debug('[App > router]', 'route:', this.route);
  };


  /* после перехода */

  indexScrollRouter.prototype.after = function(route) {};

  indexScrollRouter.prototype.show = function() {
    return app.scroll(this.el, true);
  };

  indexScrollRouter.prototype.scrollTop = function(speed) {
    return app.scroll(0, speed);
  };


  /*  404 страница */

  indexScrollRouter.prototype.notFound = function(path) {
    console.error("[App > router] route " + path + " not found");
    if (app.debugBox.state) {
      return app.debugBox.log("route", "not found");
    }
  };

  indexScrollRouter.prototype.index = function() {
    this.el = $('section[data-page="index"]');
    return this.show();
  };

  indexScrollRouter.prototype.page = function(id) {
    this.el = $('section[data-page="page"]');
    return this.show();
  };

  return indexScrollRouter;

})(Backbone.Router);
