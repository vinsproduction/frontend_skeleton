var IndexView, PrototypeView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
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
      loadtext = options && options.t ? options.t : "Load...";
      width = options && options.w ? parseInt(options.w) + "px" : "auto";
      height = options && options.h ? parseInt(options.h) + "px" : "100px";
      margin = options && options.m ? parseInt(options.m) + "px" : (parseInt(height) / 2 - 10) + "px";
      console.log("[preRender " + templateName + "] loadtext:", loadtext);
      if (loadtext) {
        return $el.css({
          'background-color': '#FFF'
        }).html("<div class=\"prerender\" style=\"position:relative;height:" + height + ";width:" + width + ";text-align:center;\">\n	<p style=\"position: relative; top:" + margin + ";\">" + loadtext + "</p>\n</div>");
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

  IndexView.prototype.resize = function() {};

  IndexView.prototype.controller = function(opt) {
    var _this = this;
    this.opt = opt != null ? opt : {};
    this.vars = {};
    this.preRender['content']({
      t: 'Load...',
      h: 130
    });
    return setTimeout(function() {
      var data;
      data = {
        test: 'Mustache rendered'
      };
      return _this.renderResponse(data);
    }, 2000);
  };

  IndexView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    this.render['content']();
    return this.listener();
  };

  IndexView.prototype.listener = function() {
    return this.template['content'].find('h1').css({
      'color': 'green'
    });
  };

  return IndexView;

})(PrototypeView);
