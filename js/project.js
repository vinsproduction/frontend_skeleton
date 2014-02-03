var Models, PrototypeModel, UserModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {
    this.fish = window.location.host === "" || /localhost/.test(window.location.host);
  }

  PrototypeModel.prototype.getFish = function(url, data, res, callback) {
    var json, obj, response;
    json = JSON.stringify(res);
    obj = $.parseJSON(json);
    response = obj.data || [];
    console.warn('[WARNING Api FISH!]', url, '| request:', data, '| response:', response);
    return callback(response);
  };

  return PrototypeModel;

})();

UserModel = (function(_super) {
  __extends(UserModel, _super);

  function UserModel() {
    _ref = UserModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UserModel.prototype.getRes = {
    "data": {
      "age": 31,
      "avatar": "http://cs5474.vk.me/u1748598/-14/x_97fe02f9.jpg",
      "birthday": "1983-01-19",
      "city": "Москва",
      "country": "Россия",
      "firstname": "Vins",
      "gender": "male",
      "id": 1,
      "lastname": "Production"
    },
    "status": "success"
  };

  /*
  	Описание: Отдает данные пользователя
  */


  UserModel.prototype.get = function(data, callback) {
    var url,
      _this = this;
    url = 'user/details';
    if (this.fish) {
      return this.getFish(url, data, this.getRes, callback);
    }
    return app.api(url, 'GET', data, function(res) {
      return callback(res);
    });
  };

  return UserModel;

})(PrototypeModel);

/* ============ Объявляем классы! ===========*/


Models = (function() {
  function Models() {
    this.user = new UserModel;
  }

  return Models;

})();

var IndexView, PrototypeView, Views, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  PrototypeView.prototype.render_debug = true;

  function PrototypeView() {
    var _this = this;
    this.varconstants = {};
    this.doResize();
    $(window).resize(function() {
      return _this.doResize();
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
    var error, height, loadtext, margin, width;
    try {
      loadtext = options && options.t ? options.t : false;
      width = options && options.w ? parseInt(options.w) + "px" : "auto";
      height = options && options.h ? parseInt(options.h) + "px" : "100px";
      margin = options && options.m ? parseInt(options.m) + "px" : (parseInt(height) / 2 - 10) + "px";
      if (this.render_debug) {
        console.log("[preRender " + templateName + "] loadtext:", loadtext);
      }
      if (loadtext) {
        return $el.html("<div class=\"prerender\" style=\"position:relative;height:" + height + ";width:" + width + ";text-align:center;\">\n	<p style=\"position: relative; top:" + margin + "; color:#FFF\">" + loadtext + "</p>\n</div>");
      } else {
        return $el.empty();
      }
    } catch (_error) {
      error = _error;
      console.error('[preRender] template undefined');
      return console.error(error);
    }
  };

  PrototypeView.prototype.doRender = function(templateName, $el, sourse, vars) {
    if (vars == null) {
      vars = this.vars;
    }
    if (this.render_debug) {
      console.log("[Render " + templateName + "]", '| @vars:', vars);
    }
    return $el.removeAttr('style').html(Mustache.to_html(sourse, vars));
  };

  PrototypeView.prototype.doResize = function(callback) {
    var footerH, headerH, sectionsH;
    this.sections = {
      el: $('body > main > .sections')
    };
    headerH = parseInt($('body > main > header').height());
    footerH = parseInt($('body > main > footer').height());
    sectionsH = parseInt($('body > main > .sections').height());
    app.debugBox.log("sect", "header: " + headerH + "px | sections: " + sectionsH + "px | footer: " + footerH + "px");
    app.debugBox.log("res", "" + ($(window).width()) + "px x " + ($(window).height()) + "px");
    return this.resize();
  };

  PrototypeView.prototype.resize = function() {};

  PrototypeView.prototype.init = function() {};

  PrototypeView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
  };

  PrototypeView.prototype.actions = function() {};

  return PrototypeView;

})();

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    _ref = IndexView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  IndexView.prototype.init = function() {
    this.el = $("section#test-render");
    this.template = {
      'content': this.el.find('.content')
    };
    return this.generateRenders();
  };

  IndexView.prototype.controller = function(opt) {
    var _this = this;
    this.opt = opt != null ? opt : {};
    this.vars = {};
    this.preRender['content']({
      t: 'Load...',
      h: 130
    });
    return app.models.user.get({}, function(res) {
      if (res.error) {
        return app.errors.popup(res.error);
      } else {
        return _this.renderResponse(res);
      }
    });
  };

  IndexView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    this.vars.avatar = this.vars.avatar ? "<img src=\"" + this.vars.avatar + "\"\" class=\"ava\">" : "";
    this.render['content']();
    return this.actions();
  };

  return IndexView;

})(PrototypeView);

/* ============ Объявляем классы! ===========*/


Views = (function() {
  function Views() {
    this.index = new IndexView;
  }

  return Views;

})();

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

  AppRouter.prototype.notFound = function(path) {
    return $('section#notFound').show();
  };

  AppRouter.prototype.ooops = function() {
    return $('section#ooops').show();
  };

  AppRouter.prototype.index = function() {
    $('section#index').show();
    return app.views['index'].controller();
  };

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
      return popup.custom('Ошибка!', text);
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
