
/* Prototype Model */
var Models, PrototypeModel, UserModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {}

  PrototypeModel.prototype.getApiPrefix = function() {
    return "api/";
  };

  PrototypeModel.prototype.get = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return app.api.get(this.getApiPrefix() + url, data, function(res) {
      if (res.status === "error") {
        console.error("[App > models] " + url + " | error: ", res.message);
      }
      if (callback) {
        return callback(res);
      }
    });
  };

  PrototypeModel.prototype.post = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return app.api.post(this.getApiPrefix() + url, data, function(res) {
      if (res.status === "error") {
        console.error("[App > models] " + url + " | error: ", res.message);
      }
      if (callback) {
        return callback(res);
      }
    });
  };

  return PrototypeModel;

})();

UserModel = (function(_super) {
  __extends(UserModel, _super);

  function UserModel() {
    return UserModel.__super__.constructor.apply(this, arguments);
  }


  /*
  	Описание: Отдает данные пользователя
   */

  UserModel.prototype.getDetails = function(data, callback) {
    return this.get('user/details', data, (function(_this) {
      return function(res) {
        return callback(res);
      };
    })(this));
  };

  return UserModel;

})(PrototypeModel);


/* ============ Объявляем классы! =========== */

Models = (function() {
  function Models() {
    this.user = new UserModel;
  }

  return Models;

})();


/* Prototype View */
var IndexHash, IndexRenderView, IndexScroll, IndexView, PrototypeView, Views, allView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  PrototypeView.prototype.render_debug = true;

  function PrototypeView() {
    this.varconstants = {};
    this.init();
  }

  PrototypeView.prototype.setRenders = function(template) {
    this.template = template;
    return _.each(this.template, (function(_this) {
      return function(val, key) {
        if (!_this.templateSourse) {
          _this.templateSourse = {};
        }
        _this.templateSourse[key] = $.trim(val.html());
        if (!_this.render) {
          _this.render = {};
        }
        _this.render[key] = function(options) {
          if (options == null) {
            options = {};
          }
          return _this.doRender(key, _this.template[key], _this.templateSourse[key], options);
        };
        if (!_this.preRender) {
          _this.preRender = {};
        }
        return _this.preRender[key] = function(options) {
          if (options == null) {
            options = {};
          }
          return _this.doPreRender(key, _this.template[key], options);
        };
      };
    })(this));
  };

  PrototypeView.prototype.doPreRender = function(templateName, $el, options) {
    var bg, color, error, height, text, top, width;
    try {
      color = options && options.color ? options.color : "inherit";
      bg = options && options.bg ? options.bg : "none";
      text = options && (options.text != null) ? options.text : "загрузка ...";
      width = options && options.width ? parseInt(options.width) + "px" : "100%";
      height = options && options.height ? parseInt(options.height) + "px" : "100%";
      top = options && options.top ? parseInt(options.top) + "px" : 0;
      if (this.render_debug) {
        console.log("[preRender " + templateName + "] loadtext:", text);
      }
      if (text != null) {
        return $el.html("<div class=\"render-preloader\" style=\"width: " + width + "; height: " + height + "; background: " + bg + "; position:relative; clear:both;\">\n	<div style=\"top:" + top + "; text-align: center; position: relative; clear:both; color: " + color + ";\">\n		" + text + "\n	</div>\n</div>");
      } else {
        return $el.html("<div class=\"render-preloader\" style=\"width: " + width + "; height: " + height + "; background: " + bg + ";\">\n	<div class=\"inner\" style=\"top:" + top + ";\">\n		<div class=\"clock\"></div>\n		<div class=\"loader\"></div>\n	</div>\n</div>");
      }
    } catch (_error) {
      error = _error;
      console.error('[preRender] template undefined');
      return console.error(error);
    }
  };

  PrototypeView.prototype.doRender = function(templateName, $el, sourse, options) {
    if (options == null) {
      options = {
        method: "html"
      };
    }
    if (this.render_debug) {
      console.log("[Render " + templateName + "]", '| @vars:', this.vars);
    }
    switch (options.method) {
      case 'append':
        return $el.append(Mustache.to_html(sourse, this.vars));
      case 'prepend':
        return $el.prepend(Mustache.to_html(sourse, this.vars));
      default:
        return $el.html(Mustache.to_html(sourse, this.vars));
    }
  };

  PrototypeView.prototype.init = function() {};

  PrototypeView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
  };

  PrototypeView.prototype.actions = function() {};

  PrototypeView.prototype.doImage = function(src, classes) {
    var photo;
    if (classes == null) {
      classes = "";
    }
    if (!src || src === "") {
      return;
    }
    if (!/http:\/\//.test(src)) {
      src = app.root + src;
    }
    photo = "<img src=\"" + src + "\" class=\"" + classes + "\" >";
    return photo;
  };

  return PrototypeView;

})();


/* Views */

allView = (function() {
  function allView() {
    this.sections = $("body > main > .sections");
    this.section = this.sections.find('> section');
  }

  return allView;

})();

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    return IndexView.__super__.constructor.apply(this, arguments);
  }

  IndexView.prototype.init = function() {};

  IndexView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index");
    app.onScroll(function(data) {
      return console.log('--> onScroll', data);
    });
    app.onResize(function(data) {
      return console.log('--> onResize', data);
    });
    $(window).resize();
    app.onHash(function(data) {
      return console.log('--> onHash', data);
    });
    return console.log('Hello! This is index controller');
  };

  return IndexView;

})(PrototypeView);

IndexRenderView = (function(_super) {
  __extends(IndexRenderView, _super);

  function IndexRenderView() {
    return IndexRenderView.__super__.constructor.apply(this, arguments);
  }

  IndexRenderView.prototype.init = function() {};

  IndexRenderView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index-render");
    this.setRenders({
      'text': this.el.find('.text')
    });
    this.vars = {};
    this.preRender['text']({
      text: 'Load...'
    });
    return app.models.user.getDetails({}, (function(_this) {
      return function(res) {
        var data;
        if (res.error) {
          return app.errors.popup(res.error);
        } else {
          data = _.clone(res);
          return _this.renderResponse(data);
        }
      };
    })(this));
  };

  IndexRenderView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    if (this.vars.avatar) {
      this.doImage(this.vars.avatar);
    }
    this.render['text']();
    return this.actions();
  };

  IndexRenderView.prototype.actions = function() {};

  return IndexRenderView;

})(PrototypeView);

IndexScroll = (function(_super) {
  __extends(IndexScroll, _super);

  function IndexScroll() {
    return IndexScroll.__super__.constructor.apply(this, arguments);
  }

  IndexScroll.prototype.init = function() {};

  IndexScroll.prototype.controller = function(opt) {
    var self;
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index-scroll");
    this.router = new indexScrollRouter;
    Backbone.history.start();
    self = this;
    this.el.find('header nav#menu li a[data-page]').click(function() {
      console.log("!" + $(this).attr('data-page'));
      self.router.navigate("!" + $(this).attr('data-page'), true);
      return false;
    });

    /* Если надо открывать каждый блок на всю страницу */
    app.onResize((function(_this) {
      return function(size) {
        return app.views.all.section.css({
          'min-height': size.windowHeight
        });
      };
    })(this));
    return $(window).trigger('resize');
  };

  return IndexScroll;

})(PrototypeView);

IndexHash = (function(_super) {
  __extends(IndexHash, _super);

  function IndexHash() {
    return IndexHash.__super__.constructor.apply(this, arguments);
  }

  IndexHash.prototype.init = function() {};

  IndexHash.prototype.controller = function(opt) {
    var self;
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index-hash");
    this.router = new indexHashRouter;
    Backbone.history.start();
    self = this;
    return this.el.find('header nav#menu li a[data-page]').click(function() {
      self.router.navigate("!" + $(this).attr('data-page'), true);
      return false;
    });
  };

  return IndexHash;

})(PrototypeView);


/* ============ Объявляем классы! =========== */

Views = (function() {
  function Views() {}

  Views.prototype.controller = function() {
    this.all = new allView;
    this.index = new IndexView;
    this.indexRender = new IndexRenderView;
    this.indexScroll = new IndexScroll;
    return this.indexHash = new IndexHash;
  };

  return Views;

})();


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


/* 
	Front-end Skeleton
	http://github.com/vinsproduction/frontend_skeleton
 */
var App,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

App = (function() {
  function App(options) {
    var livereloadPort;
    if (options == null) {
      options = {};
    }
    this.options = {
      name: 'Frontend Skeleton',

      /* Дебаг префикс в урле */
      debugUri: "debug",

      /* Визуальный дебаг префикс в урле */
      boxUri: "box",

      /* Локальный хост */
      localHost: ["", "localhost"],

      /* Удаленный хост для локальной разработки с api */
      remoteHost: "http://vinsproduction.com",

      /* Путь до картинок и прочей статики */
      root: "",

      /* Визуальный Дебагер */
      box: false
    };
    _.extend(this.options, options);
    this.name = this.options.name;
    this.remoteHost = this.options.remoteHost;
    this.root = this.options.root;
    this.boxUri = this.options.boxUri;
    this.debugUri = this.options.debugUri;

    /* Дебаг режим */
    this.debugMode = /debug/.test(window.location.search);

    /* Если хоста нет, значит - локальный просмотр! */
    this.local = window.location.host === "" || /localhost/.test(window.location.host);

    /* HOST! */
    this.host = window.location.protocol + "//" + window.location.host;

    /* Визуальный Дебагер */
    this.boxMode = new RegExp(this.boxUri).test(window.location.search) || this.options.box;

    /* Возвращает параметры визуального дебага, напр. ?box=logs -> вернет logs */
    this.boxParams = (function(_this) {
      return function() {
        var box;
        if (!_this.boxMode) {
          return [];
        }
        box = $$.urlParam(_this.boxUri);
        if (box) {
          return box.split(',');
        } else {
          return [];
        }
      };
    })(this)();

    /* Дебаг режим */
    this.debugMode = new RegExp(this.debugUri).test(window.location.search);

    /* Возвращает параметры дебага, напр. ?debug=test -> вернет test */
    this.debugParams = (function(_this) {
      return function() {
        var debug;
        if (!_this.debugMode) {
          return [];
        }
        debug = $$.urlParam(_this.debugUri);
        if (debug) {
          return debug.split(',');
        } else {
          return [];
        }
      };
    })(this)();

    /* Только для локальной разработки! */
    if (this.local && window.WebSocket) {
      livereloadPort = 777;
      $$.includeJS("http://localhost:" + livereloadPort + "/livereload.js");
      console.debug("[App > Livereload] http://localhost:" + livereloadPort + "/livereload.js");
    }

    /* Настройки библиотек */
    this.libs();

    /* Listeners */
    this.listeners();

    /* основная инизиализация */
    this.init();
  }

  App.prototype.init = function() {
    return $((function(_this) {
      return function() {

        /* Дебагер */
        if (_this.boxMode) {
          _this.debugBox.init();
        }

        /* Модели/Api */
        if (typeof Models !== "undefined" && Models !== null) {
          _this.models = new Models;
        }

        /* Контроллеры/Рендеры */
        if (typeof Views !== "undefined" && Views !== null) {
          _this.views = new Views;
          _this.views.controller();
        }

        /* Роутер */
        if (typeof Router !== "undefined" && Router !== null) {
          _this.router = new Router;
          Backbone.history.start();
        }

        /* Настройки соцсетей */
        _this.social.init();
        window.console.info("[App > onLoad]", _this.name, "Options >", _this.options, " Debug >", (_this.debugMode ? _this.debugParams : false), " Box >", (_this.boxMode ? _this.boxParams : false), " Browser > " + $$.browser.name + " ver. " + $$.browser.version);
        return $(window).trigger("AppOnLoad");
      };
    })(this));
  };

  App.prototype.listeners = function() {
    var lastScrollTop, self;
    self = this;
    this.onLoad = function(callback) {
      return $(window).on('AppOnLoad', function(event) {
        if (typeof app === "undefined" || app === null) {
          return;
        }
        if (callback) {
          return callback(app);
        }
      });
    };

    /* Scroll */

    /* Listener callback scroll
    		app.onScroll (v) ->
     */
    this.onScroll = function(callback) {
      return $(window).on('AppOnScroll', function(event, v) {
        if (callback) {
          return callback(v);
        }
      });
    };
    lastScrollTop = 0;
    $(window).scroll(function(e) {
      var action, isBottom, top, vars;
      top = self.scroll();
      if (top !== lastScrollTop) {
        isBottom = top + $(window).height() >= $(document).height();
        action = top > lastScrollTop ? 'down' : 'up';
        lastScrollTop = top;
        if (app.debugBox.state) {
          app.debugBox.log("scroll", "" + action + " | top: " + top + "px | isBottom " + isBottom);
        }
        vars = {
          top: top,
          isBottom: isBottom,
          action: action,
          e: e
        };
        return $(window).trigger("AppOnScroll", [vars]);
      }
    });

    /* Resize */

    /* Listener callback resize
    		app.onResize (v) ->
     */
    this.onResize = function(callback) {
      return $(window).on('AppOnResize', function(event, v) {
        if (callback) {
          return callback(v);
        }
      });
    };
    $(window).resize((function(_this) {
      return function() {
        var vars;
        vars = app.size();
        if (app.debugBox.state) {
          app.debugBox.log("sect", "header: " + vars.headerHeight + "px | sections: " + vars.sectionsHeight + "px | footer: " + vars.footerHeight + "px");
          app.debugBox.log("res", "" + vars.windowWidth + "px x " + vars.windowHeight + "px");
        }
        return $(window).trigger("AppOnResize", [vars]);
      };
    })(this));
    this.onLoad(function() {
      return $(window).resize();
    });

    /* Hash change */

    /* Listener callback Hash
    		app.onHash (v) ->
     */
    this.onHash = function(callback) {
      var set;
      set = false;
      $(window).on('AppOnHash', function(event, v) {
        if (callback) {
          return callback(v);
        }
      });
      if (!set) {
        if (callback) {
          callback(window.location.hash);
        }
        return set = true;
      }
    };
    $(window).on('hashchange', (function(_this) {
      return function() {
        return $(window).trigger("AppOnHash", [window.location.hash]);
      };
    })(this));
    return $(window).trigger('hashchange');
  };


  /* Scroll
  
  	app.scroll(500)
  	app.scroll(500,true)
  	app.scroll('section#guests',true)
  	app.scroll('section#guests',{time:500,easing:'easeOutElastic',done:function(){console.log('animate complete');}})
  	app.scroll($('section#guests'))
   */

  App.prototype.scroll = function(v, animate) {
    var callback, easing, el, time;
    time = (animate != null ? animate.time : void 0) || 800;
    easing = (animate != null ? animate.easing : void 0) || 'easeOutCubic';
    callback = false;
    if ((v != null) && _.isString(v)) {
      el = $(v);
      if (el[0] && _.isElement(el[0])) {
        if (animate) {
          return $('html,body').stop().animate({
            scrollTop: el.offset().top
          }, time, easing, function() {
            if (!callback) {
              callback = true;
              if (animate.done) {
                return animate.done();
              }
            }
          });
        } else {
          return $('html,body').scrollTop(el.offset().top);
        }
      }
    } else if ((v != null) && v[0] && _.isElement(v[0])) {
      if (animate) {
        return $('html,body').stop().animate({
          scrollTop: v.offset().top
        }, time, easing, function() {
          if (!callback) {
            callback = true;
            if (animate.done) {
              return animate.done();
            }
          }
        });
      } else {
        return $('html,body').scrollTop(v.offset().top);
      }
    } else if (v != null) {
      if (animate) {
        return $('html,body').stop().animate({
          scrollTop: v
        }, time, easing, function() {
          if (!callback) {
            callback = true;
            if (animate.done) {
              return animate.done();
            }
          }
        });
      } else {
        return $('html,body').scrollTop(v);
      }
    } else {
      return $(window).scrollTop();
    }
  };


  /* Размеры */

  App.prototype.size = function() {
    var vars;
    return vars = {
      windowWidth: $(window).width(),
      windowHeight: $(window).height(),
      documentWidth: $(document).width(),
      documentHeight: $(document).height(),
      bodyWidth: parseInt($('body').width()),
      bodyHeight: parseInt($('body').height()),
      mainWidth: parseInt($('body > main').width()),
      mainHeight: parseInt($('body > main').height()),
      headerWidth: parseInt($('body > main > header').width()),
      headerHeight: parseInt($('body > main > header').height()),
      footerWidth: parseInt($('body > main > footer').width()),
      footerHeight: parseInt($('body > main > footer').height()),
      sectionsWidth: parseInt($('body > main > .sections').width()),
      sectionsHeight: parseInt($('body > main > .sections').height())
    };
  };


  /* AJAX */

  App.prototype.request = function(options) {
    var ajaxData, api, callback, contentType, data, dataType, headers, logs, request, self, type, url, _ref;
    if (options == null) {
      options = {};
    }
    if (!options.url) {
      return console.error('[App > api] url not set!');
    }
    self = this;
    api = options.api || false;
    url = options.url;
    type = options.type || "GET";
    dataType = options.dataType || false;
    contentType = options.contentType || false;
    data = options.data || {};
    headers = options.headers || {};
    callback = options.callback || false;
    logs = (_ref = options.logs) != null ? _ref : true;
    $.support.cors = true;
    ajaxData = {
      url: url,
      type: type,
      data: data,
      headers: headers,
      crossDomain: true,
      cache: false
    };
    if (dataType) {
      ajaxData.dataType = dataType;
    }
    if (contentType) {
      ajaxData.contentType = contentType;
    }
    request = $.ajax(ajaxData);
    request.done(function(res) {
      var response;
      if (logs && !api) {
        response = $$.browser.msie ? JSON.stringify(res) : res;
        data = $$.browser.msie ? JSON.stringify(data) : data;
        console.debug("[" + type + "] " + url + " | params:", data, "| success: ", response);
      }
      if (callback) {
        return callback(res, 'success', false, options);
      }
    });
    request.fail(function(res, err) {
      var response;
      if (logs && !api) {
        response = $$.browser.msie ? JSON.stringify(res) : res;
        data = $$.browser.msie ? JSON.stringify(data) : data;
        console.error("[" + type + "] " + url + " | params:", data, "| fail: ", response, err);
      }
      if (callback) {
        return callback(res, 'fail', response, options);
      }
    });
  };

  App.prototype.get = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return this.request({
      url: url,
      type: 'GET',
      data: data,
      callback: function(res) {
        if (callback) {
          return callback(res);
        }
      }
    });
  };

  App.prototype.post = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return this.request({
      url: url,
      type: 'POST',
      data: data,
      callback: function(res) {
        if (callback) {
          return callback(res);
        }
      }
    });
  };

  App.prototype.getJSON = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return this.request({
      url: url,
      type: 'GET',
      data: data,
      dataType: 'json',
      callback: function(res) {
        if (callback) {
          return callback(res);
        }
      }
    });
  };


  /* @api
  	Пример запроса: app.api.get 'user/details', {}, (res) =>
  		if res.error
  				return app.errors.popup res.error
  			else
  				console.log res
   */

  App.prototype.api = {
    setUrl: function(url) {
      var host;
      host = app.local ? app.remoteHost : app.host;
      return host + '/' + url;
    },
    get: function(url, data, callback) {
      if (data == null) {
        data = {};
      }
      return app.request({
        api: true,
        url: this.setUrl(url),
        type: 'GET',
        data: data,
        dataType: 'json',
        headers: {
          'X-CSRFToken': $.cookie('csrftoken')
        },
        callback: (function(_this) {
          return function(res, state, error, options) {
            return _this.done(options, state, res, error, callback);
          };
        })(this)
      });
    },
    post: function(url, data, callback) {
      if (data == null) {
        data = {};
      }
      return app.request({
        api: true,
        url: this.setUrl(url),
        type: 'POST',
        data: data,
        dataType: 'json',
        headers: {
          'X-CSRFToken': $.cookie('csrftoken')
        },
        callback: (function(_this) {
          return function(res, state, error, options) {
            return _this.done(options, state, res, error, callback);
          };
        })(this)
      });
    },
    done: function(options, state, res, error, callback) {
      var _ref;
      if (!_.isObject(res)) {
        console.error('[API] response is not object!');
        return;
      }
      if (state === 'fail') {
        if (((_ref = res.status) === 400 || _ref === 404) && !_.isEmpty(res.responseJSON)) {
          console.debug("[" + options.type + "] API " + options.url + " | params:", options.data, "| error: ", res.responseJSON);
          if (callback) {
            return callback(res.responseJSON);
          }
        } else {
          console.error("[" + options.type + "] API " + options.url + " | params:", options.data, "| fail", error);
          return app.router.navigate('!ooops', true);
        }
      } else {
        console.debug("[" + options.type + "] API " + options.url + " | params:", options.data, "| success: ", res);
        if (callback) {
          return callback(res);
        }
      }
    }
  };


  /* Debug monitor */

  App.prototype.debugBox = {
    logs: false,
    state: false,
    init: function() {
      this.logs = app.boxMode && __indexOf.call(app.boxParams, 'logs') >= 0;
      this.state = true;
      return $('body').append("<div id=\"debugBox\" style=\"max-width: 400px;background:transparent;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#60000000,endColorstr=#60000000);background: rgba(0,0,0,0.6);position:fixed;z-index:10000; right:5px; bottom:5px;color:white; padding: 10px;\">\n	DebugBox - " + app.name + "\n	<pre class=\"browser\">browser: <span>" + $$.browser.name + " ver." + $$.browser.version + "</span></pre>\n	<pre class=\"res\">resolution: <span></span></pre>\n	<pre class=\"scroll\">scroll: <span>none</span></pre>\n	<pre class=\"route\">route: <span>none</span></pre>\n	<pre class=\"sect\"></pre>\n	<pre class=\"mediaHeight\" style=\"color:red;\"></pre>\n	<pre class=\"mediaWidth\" style=\"color:red;\"></pre>\n	<div class=\"log\" style=\"margin-top: 10px; max-height: 80px;overflow-y:auto;word-wrap: break-word;\"><div></div></div>\n</div>");
    },
    style: function() {
      var el;
      el = $('#debugBox');
      el.find(".log").css({
        'color': '#85FF00'
      }).scrollTop(el.find(".log div").height());
      return el.find("pre,span").css({
        'font': '14px monospace',
        'padding': 0,
        'margin': 0
      });
    },
    log: function(place, log) {
      switch (place) {
        case 'log':
          $('#debugBox .log div').append("<pre>" + log + "</pre>\n<pre>------</pre>");
          break;
        case 'sect':
          $('#debugBox .sect').html("<pre>" + log + "</pre>");
          break;
        case 'res':
          $('#debugBox .res span').html("" + log);
          break;
        case 'scroll':
          $('#debugBox .scroll span').html("" + log);
          break;
        case 'route':
          $('#debugBox .route span').html("" + log);
      }
      return this.style();
    }
  };


  /* Всякие библиотеки для общего пользования */

  App.prototype.libs = function() {};


  /* Социальные настройки */

  App.prototype.social = {
    init: function() {
      this.vkontakteApiId = app.local || /dev.site.ru/.test(app.host) ? '4555300' : '4574053';
      this.facebookApiId = app.local || /dev.site.ru/.test(app.host) ? '1487802001472904' : '687085858046891';
      return this.odnoklassnikiApiId = '';
    },
    auth: {
      vk: function(callback) {
        if (typeof VK === "undefined" || VK === null) {
          return console.warn('[App > auth > vk] VK is not defined');
        }
        return VK.Auth.login(function(r) {
          if (r.session) {
            console.debug('[VKONTAKTE > auth]', r.session.user);
            return callback(r.session.user);
          } else {
            return console.error('[VKONTAKTE > auth]', r);
          }
        });
      },
      fb: function(callback) {
        var getUser;
        if (typeof FB === "undefined" || FB === null) {
          return console.warn('[App > auth > fb] FB is not defined');
        }
        getUser = function(authResponse) {
          return FB.api('/me', function(r) {
            _.extend(r, authResponse);
            console.debug('[FACEBOOK > auth]', r);
            return callback(r);
          });
        };
        return FB.getLoginStatus(function(r) {
          if (r.status === 'connected') {
            return getUser(r.authResponse);
          } else {
            return FB.login(function(r) {
              if (r.authResponse) {
                return getUser(r.authResponse);
              } else {
                return console.error('[FACEBOOK > auth]', r);
              }
            }, {
              scope: 'user_likes'
            });
          }
        });
      }
    },

    /* Пост на стенку в соц. сети */
    wallPost: {
      vk: function(options) {
        if (options == null) {
          options = {};
        }
        if (typeof VK === "undefined" || VK === null) {
          return console.warn('[App > social > wallPost] VK is not defined');
        }

        /*
        				в attachments должна быть только 1 ссылка! Если надо прекрепить фото, 
        				оно должно быть залито в сам ВКонтакте
         */
        options.attachLink = options.attachLink ? ("" + app.social.url + "#") + options.attachLink : app.social.url;
        options.attachPhoto = options.attachPhoto ? options.attachPhoto : "photo131380871_321439116";
        return VK.api("wall.post", {
          owner_id: options.owner_id,
          message: options.message,
          attachments: "" + options.attachPhoto + "," + options.attachLink
        }, function(r) {
          if (!r || r.error) {
            console.error('[VKONTAKTE > wall.post]', r);
            if (options.error) {
              options.error(r.error);
            }
            if (popup && r.error && r.error.error_msg && r.error.error_code) {
              if (r.error.error_code === 214) {
                app.errors.popup("Стенка закрыта", false);
              }
            }
          } else {
            console.debug('[VKONTAKTE > wall.post] success');
            if (options.success) {
              options.success();
            }
          }
          if (options.allways) {
            return options.allways();
          }
        });
      },
      fb: function(options) {
        if (options == null) {
          options = {};
        }
        if (typeof FB === "undefined" || FB === null) {
          return console.warn('[FB > social > wallPost] FB is not defined');
        }
        return FB.ui({
          to: options.to,
          method: "feed",
          link: options.link || app.social.url,
          picture: options.picture || "",
          name: options.name || "",
          description: options.description || "",
          caption: options.caption || ""
        }, function(r) {
          if (!r) {
            console.error('[socWallPost Facebook] error', r);
            if (options.error) {
              options.error();
            }
          } else {
            console.debug('[socWallPost Facebook] success');
            if (options.success) {
              options.success();
            }
          }
          if (options.allways) {
            return options.allways();
          }
        });
      },
      ok: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        url = options.url || app.social.url;
        return window.open("http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + encodeURIComponent(url) + "&st.comments=" + encodeURIComponent(options.comments), "", "toolbar=0,status=0,width=626,height=436");
      }
    },

    /* Шаринг в сосетях */
    share: {

      /* 
      			просто хелпер для всего приложения для навешивания на ссылки, например:
      			app.social.share.it()
       */
      it: function() {
        var options;
        options = {};
        options.title = "title";
        options.description = "description";
        options.image = "" + app.host + "/img/for_post.png";
        return this.facebook(options);
      },
      vk: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        url = "http://vkontakte.ru/share.php?";
        if (options.url) {
          url += "url=" + encodeURIComponent(options.url);
        }
        if (options.title) {
          url += "&title=" + encodeURIComponent(options.title.substr(0, 100));
        }
        if (options.description) {
          url += "&description=" + encodeURIComponent(options.description.substr(0, 100) + '...');
        }
        if (options.image) {
          url += "&image=" + encodeURIComponent(options.image);
        }
        url += "&noparse=true";
        return this.popup(url);
      },
      vkCount: function(options) {
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        if (!window.VK.share) {
          window.VK.Share = {};
        }
        window.VK.Share.count = function(index, count) {
          console.debug('[VK Share count]', count);
          if (options.callback) {
            return options.callback(count);
          }
        };
        return $.getJSON('http://vkontakte.ru/share.php?act=count&index=1&url=' + escape(options.url) + '&format=json&callback=?');
      },
      ok: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1";
        if (options.url) {
          url += "&st._surl=" + encodeURIComponent(options.url);
        }
        if (options.title) {
          url += "&title=" + encodeURIComponent(options.title);
        }
        if (options.description) {
          url += "&st.comments=" + encodeURIComponent(options.description);
        }
        return this.popup(url);
      },
      okCount: function(options) {
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        if (!window.ODKL) {
          window.ODKL = {};
        }
        window.ODKL.updateCountOC = function(a, count, b, c) {
          console.debug('[OK Share count]', count);
          if (options.callback) {
            return options.callback(count);
          }
        };
        return $.getJSON('http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&callback=?&ref=' + escape(options.url));
      },
      fb: function(options) {
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        return FB.ui({
          method: 'feed',
          link: options.url,
          name: options.title ? options.title.substr(0, 100) : void 0,
          caption: options.description ? options.description.substr(0, 100) + '...' : void 0,
          picture: options.image ? options.image : void 0
        }, function(res) {});
      },
      fbCount: function(options) {
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        return $.getJSON('http://api.facebook.com/restserver.php?method=links.getStats&callback=?&urls=' + escape(options.url) + '&format=json', function(data) {
          console.debug('[FB Share count]', data[0].share_count);
          if (options.callback) {
            return options.callback(data[0].share_count);
          }
        });
      },
      tw: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        url = "http://twitter.com/share?";
        if (options.title) {
          url += "text=" + encodeURIComponent(options.title);
        }
        if (options.url) {
          url += "&url=" + encodeURIComponent(options.url);
        }
        if (options.url) {
          url += "&counturl=" + encodeURIComponent(options.url);
        }
        return this.popup(url);
      },
      twCount: function(options) {
        if (options == null) {
          options = {};
        }
        if (!options.url) {
          if (app.local) {
            options.url = app.remoteHost + window.location.pathname + window.location.hash;
          } else {
            options.url = window.location.href;
          }
        }
        return $.getJSON('http://urls.api.twitter.com/1/urls/count.json?url=' + escape(options.url) + '&callback=?', function(data) {
          console.debug('[TW Share count]', data.count);
          if (options.callback) {
            return options.callback(data.count);
          }
        });
      },
      mailru: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        options.url = options.url || app.social.url;
        url = "http://connect.mail.ru/share?";
        url += "url=" + encodeURIComponent(options.url);
        url += "&title=" + encodeURIComponent(options.title);
        url += "&description=" + encodeURIComponent(options.description);
        url += "&imageurl=" + encodeURIComponent(options.image);
        return this.popup(url);
      },
      popup: function(url) {
        return window.open(url, "", "toolbar=0,status=0,width=626,height=436");
      }
    }
  };

  App.prototype.errors = {
    popup: function(error, ru) {
      var text;
      if (ru == null) {
        ru = true;
      }
      text = ru ? this.get(error) : error;
      return popup.custom('Ошибка!', text);
    },
    get: function(error) {
      var list;
      if ($$.isObject(error)) {
        list = "";
        _.each(error, (function(_this) {
          return function(text) {
            text = _this.rus[text] || text;
            return list += text + "<br/><br/>";
          };
        })(this));
      } else {
        list = this.rus[error];
      }
      return list || "Неизвестная ошибка";
    },

    /* Русификатор */
    rus: {
      "Story doesn't exist": "Истории не существует",
      "User is not authenticated": "Юзер не авторизован"
    }
  };

  return App;

})();
