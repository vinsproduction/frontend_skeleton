
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

  indexHashRouter.prototype.show = function(pageName, pageKey) {
    var el;
    if (pageKey == null) {
      pageKey = "";
    }
    el = $("section[data-page='" + pageName + "']");
    this.hide();
    el.addClass('current').show();
    return $('body').attr('data-page', pageName).attr('data-key', pageKey);
  };

  indexHashRouter.prototype.scrollTop = function(speed) {
    return app.scroll(0, speed);
  };


  /*  404 страница */

  indexHashRouter.prototype.notFound = function(path) {
    var pageName;
    pageName = 'not-found';
    this.scrollTop();
    this.show(pageName);
    console.error("[App > router] route " + path + " not found");
    if (app.debugBox.state) {
      return app.debugBox.log("route", "not found");
    }
  };


  /* Серверная ошибка */

  indexHashRouter.prototype.ooops = function() {
    var pageName;
    pageName = 'ooops';
    this.scrollTop();
    return this.show(pageName);
  };

  indexHashRouter.prototype.index = function() {
    var pageName;
    pageName = "index";
    this.scrollTop();
    return this.show(pageName);
  };

  indexHashRouter.prototype.page = function(id) {
    var pageName;
    pageName = "page";
    this.scrollTop();
    return this.show(pageName);
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
            top: $(this).offset().top - 60
          });
        });
        sections.reverse();
        console.log('[App > indexScrollRouter > set sections]', sections);
        return app.onScroll(function(vars) {
          var find, section;
          find = _.find(sections, function(el) {
            return vars.top > el.top - 10;
          });
          section = find ? find.name : false;
          if (section) {
            _this.navigate('!' + section);
            return _this.show(section, false);
          }
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

  indexScrollRouter.prototype.hide = function() {
    return $('body > main > .sections > section').removeClass('current');
  };

  indexScrollRouter.prototype.show = function(pageName, scroll) {
    var el;
    if (scroll == null) {
      scroll = true;
    }
    el = $("section[data-page='" + pageName + "']");
    this.hide();
    el.addClass('current');
    $('body').attr('data-page', pageName);
    if (scroll) {
      return app.scroll(el.offset().top - 60, true);
    }
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
    var pageName;
    pageName = "index";
    return this.show(pageName);
  };

  indexScrollRouter.prototype.page = function(id) {
    var pageName;
    pageName = "page";
    return this.show(pageName);
  };

  return indexScrollRouter;

})(Backbone.Router);
