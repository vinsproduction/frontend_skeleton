
/* Prototype View */
var IndexView, PrototypeView, Views,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeView = (function() {
  PrototypeView.prototype.render_debug = true;

  function PrototypeView() {
    this.varconstants = {};
    this.init();
  }

  PrototypeView.prototype.generateRenders = function(template) {
    if (template == null) {
      template = this.template;
    }
    _.each(template, (function(_this) {
      return function(val, key) {
        if (!_this.templateSourse) {
          _this.templateSourse = {};
        }
        _this.templateSourse[key] = $.trim(val.html());
        if (!_this.render) {
          _this.render = {};
        }
        _this.render[key] = function(options) {
          if (options == null) {
            options = {};
          }
          return _this.doRender(key, _this.template[key], _this.templateSourse[key], options);
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
      };
    })(this));
    return this.renderAll = (function(_this) {
      return function(options) {
        return _.each(template, function(val, key) {
          return _this.render[key]();
        });
      };
    })(this);
  };

  PrototypeView.prototype.doPreRender = function(templateName, $el, options) {
    var color, error, height, loadtext, margin, width;
    try {
      color = options && options.c ? options.c : "#000";
      loadtext = options && options.t ? options.t : false;
      width = options && options.w ? parseInt(options.w) + "px" : "auto";
      height = options && options.h ? parseInt(options.h) + "px" : "100px";
      margin = options && options.m ? parseInt(options.m) + "px" : (parseInt(height) / 2 - 10) + "px";
      if (this.render_debug) {
        console.log("[preRender " + templateName + "] loadtext:", loadtext);
      }
      if (loadtext) {
        return $el.html("<div class=\"prerender\" style=\"position:relative;height:" + height + ";width:" + width + ";text-align:center;\">\n	<p style=\"position: relative; top:" + margin + "; color:" + color + "\">" + loadtext + "</p>\n</div>");
      } else {
        return $el.empty();
      }
    } catch (_error) {
      error = _error;
      console.error('[preRender] template undefined');
      return console.error(error);
    }
  };

  PrototypeView.prototype.doRender = function(templateName, $el, sourse, options) {
    if (options == null) {
      options = {
        method: "html"
      };
    }
    if (this.render_debug) {
      console.log("[Render " + templateName + "]", '| @vars:', this.vars);
    }
    switch (options.method) {
      case 'append':
        return $el.append(Mustache.to_html(sourse, this.vars));
      case 'prepend':
        return $el.prepend(Mustache.to_html(sourse, this.vars));
      default:
        return $el.html(Mustache.to_html(sourse, this.vars));
    }
  };

  PrototypeView.prototype.init = function() {};

  PrototypeView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
  };

  PrototypeView.prototype.actions = function() {};

  PrototypeView.prototype.doImage = function(src, classes) {
    var photo;
    if (classes == null) {
      classes = "";
    }
    if (!src || src === "") {
      return;
    }
    if (!/http:\/\//.test(src)) {
      src = app.root + src;
    }
    photo = "<img src=\"" + src + "\" class=\"" + classes + "\" >";
    return photo;
  };

  return PrototypeView;

})();


/* Views */

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    return IndexView.__super__.constructor.apply(this, arguments);
  }

  IndexView.prototype.init = function() {
    this.el = $("index");
    this.template = {
      'example': this.el.find('.example')
    };
    return this.generateRenders();
  };

  IndexView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
    this.vars = {};
    this.preRender['example']({
      t: 'Load...',
      h: 130
    });
    return app.models.user.get({}, (function(_this) {
      return function(res) {
        if (res.error) {
          return app.errors.popup(res.error);
        } else {
          return _this.renderResponse(res);
        }
      };
    })(this));
  };

  IndexView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    if (this.vars.avatar) {
      this.doImage(this.vars.avatar);
    }
    this.render['example']();
    return this.actions();
  };

  return IndexView;

})(PrototypeView);


/* ============ Объявляем классы! =========== */

Views = (function() {
  function Views() {
    this.index = new IndexView;
  }

  return Views;

})();
