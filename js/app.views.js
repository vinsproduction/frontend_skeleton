var IndexView, PrototypeView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  function PrototypeView() {}

  PrototypeView.prototype.varconstants = {};

  PrototypeView.prototype.preconstructor = function() {};

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

  PrototypeView.prototype.resize = function(fixed) {
    var $main, footerH, headerH, mainH, sections, sectionsH;
    sections = {
      el: $('body > main > .sections')
    };
    $main = $('body > main');
    mainH = parseInt($main.height());
    headerH = parseInt($('header').height());
    footerH = parseInt($('footer').height());
    sectionsH = mainH - headerH - footerH;
    if (fixed) {
      sections.height = sectionsH;
      sections.el.height(sections.height);
      $('body').css({
        'overflow-y': 'hidden'
      });
      $('footer').css({
        'position': 'fixed'
      });
    } else {
      sections.height = 'auto';
      sections.el.height(sections.height);
      $('body').css({
        'overflow-y': 'auto'
      });
      $('footer').css({
        'position': 'relative'
      });
    }
    app.debugBox.log("sect", "header: " + headerH + "px | sections: " + sectionsH + "px | footer: " + footerH + "px");
    return app.debugBox.log("res", "" + ($main.width()) + " x " + ($main.height()));
  };

  return PrototypeView;

})();

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    var _this = this;
    this.preconstructor();
    this.el = $("section#index");
    this.resizeit();
    $(window).resize(function() {
      return _this.resizeit();
    });
  }

  IndexView.prototype.resizeit = function() {
    return this.resize('fixed');
  };

  IndexView.prototype.controller = function(params) {};

  return IndexView;

})(PrototypeView);
