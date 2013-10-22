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
