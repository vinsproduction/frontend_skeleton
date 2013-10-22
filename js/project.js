var PrototypeModel;

PrototypeModel = (function() {
  function PrototypeModel() {}

  return PrototypeModel;

})();

var IndexView, PrototypeView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  function PrototypeView() {
    var _this = this;
    this.resize();
    $(window).resize(function() {
      return _this.resize();
    });
    this.init();
  }

  PrototypeView.prototype.generateRenders = function(template) {
    var _this = this;
    if (template == null) {
      template = this.template;
    }
    _.each(template, function(val, key) {
      if (!_this.templateSourse) {
        _this.templateSourse = {};
      }
      _this.templateSourse[key] = $.trim(val.html());
      if (!_this.render) {
        _this.render = {};
      }
      _this.render[key] = function() {
        return _this.doRender(key, _this.template[key], _this.templateSourse[key]);
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
    });
    return this.renderAll = function(options) {
      return _.each(template, function(val, key) {
        return _this.render[key]();
      });
    };
  };

  PrototypeView.prototype.doPreRender = function(templateName, $el, options) {
    var error, height, loadtext, width, _ref;
    try {
      loadtext = (_ref = options.t) != null ? _ref : "Загрузка...";
      width = parseInt(options.w) + "px" || "100%";
      height = parseInt(options.h) + "px" || "100px";
      console.log("[preRender " + templateName + "] loadtext:", loadtext);
      if (loadtext) {
        return $el.css({
          'background-color': '#FFF'
        }).html("<div style=\"padding:10px;height:" + height + ";width:" + width + ";\"><center>" + loadtext + "</center></div>");
      } else {
        return $el.empty();
      }
    } catch (_error) {
      error = _error;
      console.error('template undefined');
      return console.error(error);
    }
  };

  PrototypeView.prototype.doRender = function(templateName, $el, sourse, vars) {
    if (vars == null) {
      vars = this.vars;
    }
    console.log("[Render " + templateName + "] @vars:", this.vars);
    return $el.removeAttr('style').html(Mustache.to_html(sourse, vars));
  };

  PrototypeView.prototype.resize = function() {
    var footerH, headerH, sectionsH;
    this.sections = {
      el: $('body > main > .sections')
    };
    headerH = parseInt($('body > main > header').height());
    footerH = parseInt($('body > main > footer').height());
    sectionsH = parseInt($('body > main > .sections').height());
    if ($(window).height() <= sectionsH + headerH + footerH) {
      this.sections.height = sectionsH;
      this.sections.el.height(this.sections.height);
      $('body > main > footer').removeClass('fixed');
    } else {
      this.sections.height = 'auto';
      this.sections.el.height(this.sections.height);
      $('body > main > footer').addClass('fixed');
    }
    app.debugBox.log("sect", "header: " + headerH + "px | sections: " + sectionsH + "px | footer: " + footerH + "px");
    app.debugBox.log("res", "" + ($(window).width()) + "px x " + ($(window).height()) + "px");
    return this.afterResize();
  };

  PrototypeView.prototype.afterResize = function() {};

  PrototypeView.prototype.init = function() {};

  PrototypeView.prototype.controller = function(opt) {
    if (opt == null) {
      opt = {};
    }
  };

  return PrototypeView;

})();

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    _ref = IndexView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return IndexView;

})(PrototypeView);

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

var App,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

App = (function() {
  function App(options) {
    var livereloadPort,
      _this = this;
    if (options == null) {
      options = {};
    }
    this.name = 'project';
    this.localhost = window.location.host === "";
    this.host = this.localhost ? "http://" + this.name : window.location.host;
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
      _this.initViews();
      _this.router = new AppRouter;
      Backbone.history.start();
      _this.social.init();
      return console.debug('[App::init] debug:', _this.debug, _this);
    });
  };

  App.prototype.initViews = function() {
    return this.views = {
      index: new IndexView
    };
  };

  App.prototype.redirect = function(page) {
    if (page == null) {
      page = "";
    }
    return this.router.navigate(page, true);
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

  App.prototype.erros = {
    popup: function(error) {
      var text;
      text = this.getError(error);
      return customPopup('Ошибка!', text, true);
    },
    get: function(error) {
      var errors, list;
      errors = this.errors_ru();
      if ($$.isObject(error)) {
        list = "";
        _.each(error, function(text) {
          text = errors[text] || text;
          return list += text + "<br/><br/>";
        });
      } else {
        list = errors[error];
      }
      return list || "Неизвестная ошибка";
    },
    ru: function() {
      return {
        "Error_1": "Первая ошибка"
      };
    }
  };

  return App;

})();
