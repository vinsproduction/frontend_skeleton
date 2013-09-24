var ArticlesView, PrototypeView,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  function PrototypeView() {}

  PrototypeView.prototype.varconstants = {};

  PrototypeView.prototype.preconstructor = function() {
    this.localView = (function() {
      if (__indexOf.call(app.debug, "localview") >= 0) {
        return true;
      } else {
        return false;
      }
    })();
    return this.varconstants.root = this.localView ? "" : window.app.root;
  };

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

  return PrototypeView;

})();

ArticlesView = (function(_super) {
  __extends(ArticlesView, _super);

  function ArticlesView() {
    this.preconstructor();
    this.el = $("section#articles");
    this.template = {
      'new': this.el.find(".new"),
      'popular': this.el.find(".popular")
    };
    this.generateRenders();
  }

  ArticlesView.prototype.controller = function(params) {
    var _this = this;
    this.vars = {};
    this.preRender['new']();
    this.preRender['popular']();
    this.articles = new Articles({
      localView: this.localView
    });
    return this.articles.get(function(data) {
      return _this.renderResponse(data);
    });
  };

  ArticlesView.prototype.listeners = function() {};

  ArticlesView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    this.render['new']();
    this.render['popular']();
    return this.listeners();
  };

  return ArticlesView;

})(PrototypeView);
