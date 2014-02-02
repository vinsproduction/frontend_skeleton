var App,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

App = (function() {
  function App(options) {
    var livereloadPort,
      _this = this;
    if (options == null) {
      options = {};
    }
    this.name = 'Frontend Skeleton';
    this.localhost = window.location.host === "" || /localhost/.test(window.location.host);
    this.host = this.localhost ? "http://vinsproduction.com" : "http://" + window.location.host;
    this.root = options.root || "";
    this.debug = (function() {
      var debug;
      debug = $$.urlParam('debug');
      if (debug) {
        return debug.split(',');
      } else {
        return [];
      }
    })();
    if (!$$.browser.msie && this.localhost) {
      livereloadPort = 777;
      $$.includeJS("http://localhost:" + livereloadPort + "/livereload.js");
      console.debug("[Livereload] http://localhost:" + livereloadPort + "/livereload.js");
    }
    if ($$.browser.msie6 || $$.browser.msie7) {
      return;
    }
    this.libs();
  }

  App.prototype.init = function() {
    var _this = this;
    return $(function() {
      if (__indexOf.call(_this.debug, 'box') >= 0) {
        _this.debugBox.init();
      }
      if (Models) {
        _this.models = new Models;
      }
      if (Views) {
        _this.views = new Views;
      }
      _this.router = new AppRouter;
      Backbone.history.start();
      _this.social.init();
      return console.debug('[App::init] debug:', _this.debug, _this);
    });
  };

  App.prototype.redirect = function(page) {
    if (page == null) {
      page = "";
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


  App.prototype.api = function(url, type, data, callback) {
    var prefix;
    if (type == null) {
      type = "GET";
    }
    if (data == null) {
      data = {};
    }
    prefix = '/api/v1/';
    url = app.host + prefix + url;
    return $.ajax({
      type: type,
      url: url,
      data: data
    }).done(function(res) {
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
    }).fail(function(res) {
      var response;
      response = $$.browser.msie ? JSON.stringify(res) : res;
      console.error("[Api] " + url + " | " + type + ":", data, "| fail: ", response);
      if (res.readyState === 4 && res.status === 404) {
        return app.redirect('/404');
      } else {
        return app.redirect('/ooops');
      }
    });
  };

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

  App.prototype.libs = function() {
    jQuery.support.cors = true;
    return jQuery.ajaxSetup({
      cache: false,
      crossDomain: true
    });
  };

  App.prototype.social = {
    defaults: {
      vkontakteApiId: '',
      facebookApiId: '',
      odnoklassnikiApiId: ''
    },
    init: function() {
      var _init;
      return _init = function() {
        app.social.url = this.host;
        if (VK) {
          VK.init({
            apiId: app.social.vkontakteApiId
          });
        }
        if (FB) {
          return FB.init({
            appId: app.social.facebookApiId,
            status: true,
            cookie: true,
            xfbml: true,
            oauth: true
          });
        }
      };
    },
    wallPost: {
      vkontakte: function(options) {
        if (options == null) {
          options = {};
        }
        return VK.api("wall.post", {
          owner_id: options.owner_id,
          message: options.message
        }, function(r) {
          if (!r || r.error) {
            console.error('[socWallPost Vkontakte] error', r);
            if (options.error) {
              options.error();
            }
          } else {
            console.debug('[socWallPost Vkontakte] success');
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
    share: {
      vkontakte: function(options) {
        var url;
        if (options == null) {
          options = {};
        }
        options.url = options.url || app.social.url;
        url = "http://vkontakte.ru/share.php?";
        url += "url=" + encodeURIComponent(options.url);
        url += "&title=" + encodeURIComponent(options.title);
        url += "&description=" + encodeURIComponent(options.text);
        url += "&image=" + encodeURIComponent(options.img);
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
        url += "&st.comments=" + encodeURIComponent(options.text);
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
        url += "&p[summary]=" + encodeURIComponent(options.text);
        url += "&p[url]=" + encodeURIComponent(options.url);
        url += "&p[images][0]=" + encodeURIComponent(options.img);
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
        url += "&description=" + encodeURIComponent(options.text);
        url += "&imageurl=" + encodeURIComponent(options.img);
        return this.popup(url);
      },
      popup: function(url) {
        return window.open(url, "", "toolbar=0,status=0,width=626,height=436");
      }
    }
  };

  App.prototype.errors = {
    popup: function(error) {
      var text;
      text = this.get(error);
      return popup.custom('Ошибка!', text, true);
    },
    get: function(error) {
      var list,
        _this = this;
      if ($$.isObject(error)) {
        list = "";
        _.each(error, function(text) {
          text = _this.rus[text] || text;
          return list += text + "<br/><br/>";
        });
      } else {
        list = this.rus[error];
      }
      return list || "Неизвестная ошибка";
    },
    rus: {
      "Story doesn't exist": "Истории не существует",
      "User is not authenticated": "Юзер не авторизован"
    }
  };

  return App;

})();
