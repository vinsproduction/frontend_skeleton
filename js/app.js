
/* Front-end Skeleton / ver. 2.2 / rev. 27.03.2014 / vinsproduction */
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

      /* Хеш навигация в проекте */
      hashNavigate: false,

      /* Удаленный хост для локальной разработки с api */
      remoteHost: "http://vinsproduction.com",

      /* Путь до картинок и прочей статики */
      root: "",

      /* Визуальный дебаггер */
      box: false,

      /* Callback загрузки приложения */
      onLoad: function() {}
    };
    _.extend(this.options, options);
    this.name = this.options.name;
    this.hashNavigate = this.options.hashNavigate;
    this.remoteHost = this.options.remoteHost;
    this.root = this.options.root;
    this.box = this.options.box;
    this.onLoad = this.options.onLoad;

    /* Настройка window.console */
    this.console();

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
    if (this.local && window.WebSocket) {
      livereloadPort = 777;
      $$.includeJS("http://localhost:" + livereloadPort + "/livereload.js");
      console.debug("[App > Livereload] http://localhost:" + livereloadPort + "/livereload.js");
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
        if (__indexOf.call(_this.debug, 'box') >= 0 || _this.box) {
          _this.debugBox.init();
        }

        /* Слушатели */
        _this.listeners();

        /* Модели/Api */
        if (Models) {
          _this.models = new Models;
        }

        /* Контроллеры/Рендеры */
        if (Views) {
          _this.views = new Views;
        }

        /* Роутер/Хеш навигация */
        if (_this.hashNavigate) {
          _this.router = new Router;
          Backbone.history.start();
        }

        /* Настройки соцсетей */
        _this.social.init();
        window.console.info("[App > onLoad]", _this.name, "Options >", _this.options, " Debug >", _this.debug, " Browser > " + $$.browser.name + " ver. " + $$.browser.version);
        return _this.onLoad();
      };
    })(this));
  };

  App.prototype.console = function() {
    var log, self;
    self = this;
    window.originalConsole = console;
    window.console = {
      log: function() {},
      debug: function() {},
      warn: function() {},
      info: function() {},
      error: function() {}
    };
    log = function() {
      var args, argument, e, type, _i, _len;
      type = arguments[0];
      args = _.rest(arguments);
      log = "";
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        argument = args[_i];
        log += _.isObject(argument) ? $$.jlog(argument) : argument;
        log += " ";
      }
      log = _.escape(log);
      try {
        switch (type) {
          case 'log':
            this.log.apply(this, args);
            break;
          case 'debug':
            this.debug.apply(this, args);
            break;
          case 'warn':
            this.warn.apply(this, args);
            break;
          case 'info':
            this.info.apply(this, args);
            break;
          case 'error':
            this.error.apply(this, args);
        }
      } catch (_error) {
        e = _error;
        switch (type) {
          case 'log':
            this.log(log);
            break;
          case 'debug':
            this.debug(log);
            break;
          case 'warn':
            this.warn(log);
            break;
          case 'info':
            this.info(log);
            break;
          case 'error':
            this.error(log);
        }
      }
      if ((__indexOf.call(self.debug, 'box') >= 0 || self.box) && self.debugBox.state && self.debugBox.logs) {
        self.debugBox.log('log', log);
      }
    };
    window.console.log = _.bind(log, window.originalConsole, 'log');
    window.console.debug = _.bind(log, window.originalConsole, 'debug');
    window.console.warn = _.bind(log, window.originalConsole, 'warn');
    window.console.info = _.bind(log, window.originalConsole, 'info');
    return window.console.error = _.bind(log, window.originalConsole, 'error');
  };

  App.prototype.listeners = function() {
    var lastScrollTop, self;
    self = this;

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
      var action, top, vars;
      top = self.scroll();
      if (top !== lastScrollTop) {
        action = top > lastScrollTop ? 'down' : 'up';
        lastScrollTop = top;
        if (app.debugBox.state) {
          app.debugBox.log("scroll", "" + action + " | top: " + top + "px");
        }
        vars = {
          top: top,
          action: action,
          e: e
        };
        return $(window).trigger("AppOnScroll", [vars]);
      }
    });
    $(window).scroll();

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
    return $(window).resize();
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


  /* Hash навигация */

  App.prototype.routePrefix = "!";

  App.prototype.redirect = function(page) {
    if (page == null) {
      page = "";
    }
    console.debug('[App > redirect]', page);
    if (window.location.hash === ("#" + this.routePrefix) + page) {
      this.router.navigate("redirect");
    }
    return this.router.navigate(this.routePrefix + page, true);
  };


  /* @API
  	Пример запроса: app.api.request 'user/details', 'GET', {}, (res) =>
  		if res.error
  				return app.errors.popup res.error
  			else
  				console.log res
   */


  /* API pefix, например номер версии серверного api /api/v1/ */

  App.prototype.apiPrefix = "";

  App.prototype.api = function(url, type, data, callback) {
    var host;
    if (type == null) {
      type = "GET";
    }
    if (data == null) {
      data = {};
    }
    host = this.local ? this.remoteHost : this.host;
    url = host + "/" + this.apiPrefix + url;
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
          console.debug("[App > api] " + url + " | " + type + ":", data, "| success: ", response);
          if (callback) {
            return callback(res.data);
          }
        } else if (res.status === 'error') {
          console.error("[App > api] " + url + " | " + type + ":", data, "| error: ", response);
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
        console.error("[App > api] " + url + " | " + type + ":", data, "| fail: ", response);
        if (res.readyState === 4 && res.status === 404) {

          /* запрос в никуда */
          if (_this.hashNavigate) {
            return app.redirect("server-404");
          }
        } else {

          /* серверная ошибка */
          if (_this.hashNavigate) {
            return app.redirect("server-error");
          }
        }
      };
    })(this));
  };


  /* Debug monitor */

  App.prototype.debugBox = {
    logs: true,
    state: false,
    init: function() {
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

  App.prototype.libs = function() {
    $.support.cors = true;
    return $.ajaxSetup({
      cache: false,
      crossDomain: true
    });
  };


  /* Социальные настройки */

  App.prototype.social = {
    vkontakteApiId: '',
    facebookApiId: '283793001782971',
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
        options.url = options.url || app.social.url;
        url = "http://vkontakte.ru/share.php?";
        url += "url=" + encodeURIComponent(options.url);
        url += "&title=" + encodeURIComponent(options.title);
        url += "&description=" + encodeURIComponent(options.description);
        url += "&image=" + encodeURIComponent(options.image);
        url += "&noparse=true";
        return this.popup(url);
      },
      vkCount: function(url, callback) {
        var VK;
        url = url || app.social.url;
        if (!VK) {
          VK = {
            Share: {}
          };
        }
        VK.Share.count = function(index, count) {
          if (callback) {
            return callback(count);
          }
        };
        return $.getJSON('http://vkontakte.ru/share.php?act=count&index=1&url=' + url + '&format=json&callback=?');
      },
      ok: function(options) {
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
      okCount: function(url, callback) {
        var ODKL;
        url = url || app.social.url;
        if (!ODKL) {
          ODKL = {};
        }
        ODKL.updateCountOC = function(a, count, b, c) {
          if (callback) {
            return callback(count);
          }
        };
        return $.getJSON('http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&callback=?&ref=' + url);
      },
      fb: function(options) {
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
      fbCount: function(url, callback) {
        url = url || app.social.url;
        return $.getJSON('http://api.facebook.com/restserver.php?method=links.getStats&callback=?&urls=' + escape(url) + '&format=json', function(data) {
          if (callback) {
            return callback(data[0].share_count);
          }
        });
      },
      tw: function(options) {
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
      twCount: function(url, callback) {
        url = url || app.social.url;
        return $.getJSON('http://urls.api.twitter.com/1/urls/count.json?url=' + url + '&callback=?', function(data) {
          if (callback) {
            return callback(data.count);
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
