
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
        console.debug("[App]", _this.name, "onLoad", "options:", _this.opt);
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
