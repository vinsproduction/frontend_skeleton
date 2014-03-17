
/* Prototype Model */
var Models, PrototypeModel, UserModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {}

  PrototypeModel.prototype.get = function(url, data, callback) {
    return app.api(url, 'GET', data, function(res) {
      return callback(res);
    });
  };

  PrototypeModel.prototype.post = function(url, data, callback) {
    return app.api(url, 'POST', data, function(res) {
      return callback(res);
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
    return this.get('api/user/details', data, (function(_this) {
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
var IndexView, PrototypeView, Views,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  PrototypeView.prototype.render_debug = true;

  function PrototypeView() {
    this.varconstants = {};
    this.init();
    this.doResize();
    $(window).resize((function(_this) {
      return function() {
        return _this.doResize();
      };
    })(this));
  }

  PrototypeView.prototype.generateRenders = function(template) {
    if (template == null) {
      template = this.template;
    }
    _.each(template, (function(_this) {
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
    return this.renderAll = (function(_this) {
      return function(options) {
        return _.each(template, function(val, key) {
          return _this.render[key]();
        });
      };
    })(this);
  };

  PrototypeView.prototype.doPreRender = function(templateName, $el, options) {
    var color, error, height, loadtext, margin, width;
    try {
      color = options && options.c ? options.c : "#000";
      loadtext = options && options.t ? options.t : false;
      width = options && options.w ? parseInt(options.w) + "px" : "auto";
      height = options && options.h ? parseInt(options.h) + "px" : "100px";
      margin = options && options.m ? parseInt(options.m) + "px" : (parseInt(height) / 2 - 10) + "px";
      if (this.render_debug) {
        console.log("[preRender " + templateName + "] loadtext:", loadtext);
      }
      if (loadtext) {
        return $el.html("<div class=\"prerender\" style=\"position:relative;height:" + height + ";width:" + width + ";text-align:center;\">\n	<p style=\"position: relative; top:" + margin + "; color:" + color + "\">" + loadtext + "</p>\n</div>");
      } else {
        return $el.empty();
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

  PrototypeView.prototype.doResize = function(callback) {
    var footerH, headerH, sectionsH, windowH;
    this.sections = {
      el: $('body > main > .sections')
    };
    headerH = parseInt($('body > main > header').height());
    footerH = parseInt($('body > main > footer').height());
    sectionsH = parseInt($('body > main > .sections').height());
    windowH = $(window).height();
    app.debugBox.log("header: " + headerH + "px | sections: " + sectionsH + "px | footer: " + footerH + "px", "sect");
    app.debugBox.log("" + ($(window).width()) + "px x " + ($(window).height()) + "px", "res");
    return this.resize();
  };

  PrototypeView.prototype.resize = function() {};

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

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    return IndexView.__super__.constructor.apply(this, arguments);
  }

  IndexView.prototype.init = function() {
    this.el = $("index");
    this.template = {
      'example': this.el.find('.example')
    };
    return this.generateRenders();
  };

  IndexView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
    this.vars = {};
    this.preRender['example']({
      t: 'Load...',
      h: 130
    });
    return app.models.user.get({}, (function(_this) {
      return function(res) {
        if (res.error) {
          return app.errors.popup(res.error);
        } else {
          return _this.renderResponse(res);
        }
      };
    })(this));
  };

  IndexView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    if (this.vars.avatar) {
      this.doImage(this.vars.avatar);
    }
    this.render['example']();
    return this.actions();
  };

  return IndexView;

})(PrototypeView);


/* ============ Объявляем классы! =========== */

Views = (function() {
  function Views() {
    this.index = new IndexView;
  }

  return Views;

})();


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


/* Front-end Skeleton / ver. 2.0 / 17.03.2014 */
var App,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

App = (function() {
  App.prototype.name = 'Frontend Skeleton';


  /* Хеш навигация в проекте */

  App.prototype.hashNavigate = false;


  /* Удаленный хост для локальной разработки с api */

  App.prototype.remoteHost = "http://vinsproduction.com";


  /* Путь до картинок и прочей статики */

  App.prototype.root = "";


  /* Callback загрузки приложения */

  App.prototype.onLoad = function() {};

  function App(opt) {
    var k, livereloadPort, v, _ref;
    this.opt = opt != null ? opt : {};
    _ref = this.opt;
    for (k in _ref) {
      v = _ref[k];
      this[k] = v;
    }

    /* Дебаг режим */
    this.debugMode = /debug/.test(window.location.search);

    /* Если хоста нет, значит - локальный просмотр! */
    this.local = window.location.host === "" || /localhost/.test(window.location.host);

    /* HOST! */
    this.host = window.location.protocol + "//" + window.location.host;

    /* Возвращает параметры дебага, напр. ?debug=test -> вернет test */
    this.debug = (function(_this) {
      return function() {
        var debug;
        debug = $$.urlParam('debug');
        if (debug) {
          return debug.split(',');
        } else {
          return [];
        }
      };
    })(this)();

    /* Только для локальной разработки! */
    if (!$$.browser.msie && this.local) {
      livereloadPort = 777;
      $$.includeJS("http://localhost:" + livereloadPort + "/livereload.js");
      console.debug("[Livereload] http://localhost:" + livereloadPort + "/livereload.js");
    }

    /* Если Ie! */
    if ($$.browser.msie6 || $$.browser.msie7) {
      return;
    }

    /* Настройки библиотек */
    this.libs();

    /* основная инизиализация */
    this.init();
  }

  App.prototype.init = function() {
    return $((function(_this) {
      return function() {

        /* Дебагер */
        if (__indexOf.call(_this.debug, 'box') >= 0) {
          _this.debugBox.init();
        }

        /* модели/api */
        if (Models) {
          _this.models = new Models;
        }

        /* контроллеры/рендеры */
        if (Views) {
          _this.views = new Views;
        }

        /* Роутер/хеш навигация */
        if (_this.hashNavigate) {
          _this.router = new Router;
          Backbone.history.start();
        }

        /* Настройки соцсетей */
        _this.social.init();
        console.debug("[App]", _this.name, "Options:", _this.opt);
        return _this.onLoad();
      };
    })(this));
  };


  /* Hash навигация */

  App.prototype.redirect = function(page) {
    if (page == null) {
      page = "";
    }
    console.debug('[App > redirect]', page);
    if (window.location.hash === "#!" + page) {
      this.router.navigate("!/redirect");
    }
    return this.router.navigate("!" + page, true);
  };


  /* @API
  	Пример запроса: app.api.request 'user/details', 'GET', {}, (res) =>
  		if res.error
  				return app.errors.popup res.error
  			else
  				console.log res
   */


  /* API pefix, например номер версии серверного api /api/v1/ */

  App.prototype.apiPrefix = "/";

  App.prototype.api = function(url, type, data, callback) {
    var host;
    if (type == null) {
      type = "GET";
    }
    if (data == null) {
      data = {};
    }
    host = this.local ? this.remoteHost : this.host;
    url = host + this.apiPrefix + url;
    return $.ajax({
      type: type,
      dataType: 'json',
      url: url,
      data: data
    }).done((function(_this) {
      return function(res) {
        var response;
        response = $$.browser.msie ? JSON.stringify(res) : res;
        if (res.status === 'success') {
          if (!res.data) {
            res.data = [];
          }
          console.debug("[Api] " + url + " | " + type + ":", data, "| success: ", response);
          if (callback) {
            return callback(res.data);
          }
        } else if (res.status === 'error') {
          console.error("[Api] " + url + " | " + type + ":", data, "| error: ", response);
          if (callback) {
            return callback({
              error: res.error
            });
          }
        }
      };
    })(this)).fail((function(_this) {
      return function(res) {
        var response;
        response = $$.browser.msie ? JSON.stringify(res) : res;
        console.error("[Api] " + url + " | " + type + ":", data, "| fail: ", response);
        if (res.readyState === 4 && res.status === 404) {

          /* запрос в никуда */
          if (_this.hashNavigate) {
            return app.redirect('/404');
          }
        } else {

          /* серверная ошибка */
          if (_this.hashNavigate) {
            return app.redirect('/ooops');
          }
        }
      };
    })(this));
  };


  /* Debug monitor */

  App.prototype.debugBox = {
    init: function() {
      return $('body').append("<div id=\"debugBox\" style=\"font-size: 14px;background: rgba(0,0,0,0.6);position:fixed;z-index:10000; right:5px; bottom:5px;color:white; padding: 10px;\">\n	debug box\n	<pre class=\"res\">resolution: <span></span></pre>\n	<div class=\"sect\"></div>\n	<div class=\"log\"></div>\n	<pre class=\"mediaHeight\" style=\"color:red;\"></pre>\n	<pre class=\"mediaWidth\" style=\"color:red;\"></pre>\n</div>");
    },
    color: function() {
      return $('#debugBox').find(".log pre:nth-child(2n)").css({
        color: 'gray'
      });
    },
    log: function(place, log) {
      if (place === 'log') {
        $('#debugBox .log').append("<pre>" + log + "</pre>");
      } else if (place === 'sect') {
        $('#debugBox .sect').html("<pre>" + log + "</pre>");
      } else if (place === 'res') {
        $('#debugBox .res span').html("" + log);
      }
      return app.debugBox.color();
    }
  };


  /* Всякие библиотеки для общего пользования */

  App.prototype.libs = function() {

    /* Крайне важная штука для ajax запросов в рамках разных доменов, в IE! */
    $.support.cors = true;
    return $.ajaxSetup({
      cache: false,
      crossDomain: true
    });
  };


  /* Социальные настройки */

  App.prototype.social = {
    vkontakteApiId: '',
    facebookApiId: '',
    odnoklassnikiApiId: '',
    init: function() {
      return this.url = app.local ? app.remoteHost : app.host;
    },

    /* Пост на стенку в соц. сети */
    wallPost: {
      vkontakte: function(options) {
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
      facebook: function(options) {
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
      odnoklassniki: function(options) {
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
      itVk: function() {
        var options;
        options = {};
        options.title = "title";
        options.description = "description";
        options.url = app.social.url;
        options.image = "" + app.host + "/img/for_post.png";
        return this.vkontakte(options);
      },
      vkontakte: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        options.url = options.url || app.social.url;
        url = "http://vkontakte.ru/share.php?";
        url += "url=" + encodeURIComponent(options.url);
        url += "&title=" + encodeURIComponent(options.title);
        url += "&description=" + encodeURIComponent(options.description);
        url += "&image=" + encodeURIComponent(options.image);
        url += "&noparse=true";
        return this.popup(url);
      },
      odnoklassniki: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        options.url = options.url || app.social.url;
        url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1";
        url += "&st.comments=" + encodeURIComponent(options.description);
        url += "&st._surl=" + encodeURIComponent(options.url);
        return this.popup(url);
      },
      facebook: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        options.url = options.url || app.social.url;
        url = "http://www.facebook.com/sharer.php?s=100";
        url += "&p[title]=" + encodeURIComponent(options.title);
        url += "&p[summary]=" + encodeURIComponent(options.description);
        url += "&p[url]=" + encodeURIComponent(options.url);
        url += "&p[images][0]=" + encodeURIComponent(options.image);
        return this.popup(url);
      },
      twitter: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        options.url = options.url || app.social.url;
        url = "http://twitter.com/share?";
        url += "text=" + encodeURIComponent(options.title);
        url += "&url=" + encodeURIComponent(options.url);
        url += "&counturl=" + encodeURIComponent(options.url);
        return this.popup(url);
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
