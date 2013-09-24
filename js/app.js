var App;

App = (function() {
  function App() {
    var livereloadPort,
      _this = this;
    this.name = 'TPS';
    this.localhost = window.location.host === "";
    this.host = this.localhost ? "http://" + this.name : window.location.host;
    this.root = this.localhost ? this.host : "";
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
      livereloadPort = 35829;
      $$.includeJS("http://localhost:" + livereloadPort + "/livereload.js");
      console.debug("[Livereload::init] port " + livereloadPort);
    }
    if ($$.browser.msie6 || $$.browser.msie7) {
      return;
    }
    this.libs();
  }

  App.prototype.init = function() {
    var _this = this;
    return $(function() {
      _this.social.init();
      return console.debug('[App::init] debug:', _this.debug, _this);
    });
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
      vkontakteApiId: '3819447',
      facebookApiId: '228658570618080',
      odnoklassnikiApiId: '192750592'
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
        return window.open("http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + encodeURIComponent(url) + "&st.comments=" + encodeURIComponent(options.comments), "", "width=600,height=380");
      }
    },
    share: {
      vkontakte: function(purl, ptitle, pimg, text) {
        var url;
        url = "http://vkontakte.ru/share.php?";
        url += "url=" + encodeURIComponent(purl);
        url += "&title=" + encodeURIComponent(ptitle);
        url += "&description=" + encodeURIComponent(text);
        url += "&image=" + encodeURIComponent(pimg);
        url += "&noparse=true";
        return this.popup(url);
      },
      odnoklassniki: function(purl, text) {
        var url;
        url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1";
        url += "&st.comments=" + encodeURIComponent(text);
        url += "&st._surl=" + encodeURIComponent(purl);
        return this.popup(url);
      },
      facebook: function(purl, ptitle, pimg, text) {
        var url;
        url = "http://www.facebook.com/sharer.php?s=100";
        url += "&p[title]=" + encodeURIComponent(ptitle);
        url += "&p[summary]=" + encodeURIComponent(text);
        url += "&p[url]=" + encodeURIComponent(purl);
        url += "&p[images][0]=" + encodeURIComponent(pimg);
        return this.popup(url);
      },
      twitter: function(purl, ptitle) {
        var url;
        url = "http://twitter.com/share?";
        url += "text=" + encodeURIComponent(ptitle);
        url += "&url=" + encodeURIComponent(purl);
        url += "&counturl=" + encodeURIComponent(purl);
        return this.popup(url);
      },
      mailru: function(purl, ptitle, pimg, text) {
        var url;
        url = "http://connect.mail.ru/share?";
        url += "url=" + encodeURIComponent(purl);
        url += "&title=" + encodeURIComponent(ptitle);
        url += "&description=" + encodeURIComponent(text);
        url += "&imageurl=" + encodeURIComponent(pimg);
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
