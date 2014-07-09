
/* Prototype View */
var IndexHash, IndexRenderView, IndexScroll, IndexView, PrototypeView, Views, allView,
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
    var bg, color, error, height, text, top, width;
    try {
      color = options && options.color ? options.color : "#000";
      bg = options && options.bg ? options.bg : "none";
      text = options && options.text ? options.text : true;
      width = options && options.width ? parseInt(options.width) + "px" : "100%";
      height = options && options.height ? parseInt(options.height) + "px" : "100%";
      top = options && options.top ? parseInt(options.top) + "px" : (parseInt(height) / 2 - 10) + "px";
      if (this.render_debug) {
        console.log("[preRender " + templateName + "] loadtext:", text);
      }
      if (text) {
        return $el.html("<div style=\"width: " + width + "; height: " + height + "; background: " + bg + "; position:relative; clear:both;\">\n	<div style=\"top:" + top + "; text-align: center; position: relative; clear:both; color: " + color + ";\">\n		" + text + "\n	</div>\n</div>");
      } else {
        return $el.html("<div id=\"preload\" style=\"width: " + width + "; height: " + height + "; background: " + bg + ";\">\n	<div class=\"inner\" style=\"top:" + top + ";\">\n		<div class=\"clock\"></div>\n		<div class=\"loader\"></div>\n	</div>\n</div>");
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

allView = (function() {
  function allView() {
    this.sections = $("body > main > .sections");
    this.section = this.sections.find('> section');
  }

  return allView;

})();

IndexView = (function(_super) {
  __extends(IndexView, _super);

  function IndexView() {
    return IndexView.__super__.constructor.apply(this, arguments);
  }

  IndexView.prototype.init = function() {};

  IndexView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index");
    return console.log('Hello! This is index controller');
  };

  return IndexView;

})(PrototypeView);

IndexRenderView = (function(_super) {
  __extends(IndexRenderView, _super);

  function IndexRenderView() {
    return IndexRenderView.__super__.constructor.apply(this, arguments);
  }

  IndexRenderView.prototype.init = function() {};

  IndexRenderView.prototype.controller = function(opt) {
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index-render");
    this.template = {
      'text': this.el.find('.text')
    };
    this.generateRenders();
    this.vars = {};
    this.preRender['text']({
      text: 'Load...'
    });
    return app.models.user.getDetails({}, (function(_this) {
      return function(res) {
        if (res.error) {
          return app.errors.popup(res.error);
        } else {
          return _this.renderResponse(res);
        }
      };
    })(this));
  };

  IndexRenderView.prototype.renderResponse = function(data) {
    _.extend(this.vars, this.varconstants);
    _.extend(this.vars, data);
    if (this.vars.avatar) {
      this.doImage(this.vars.avatar);
    }
    this.render['text']();
    return this.actions();
  };

  IndexRenderView.prototype.actions = function() {};

  return IndexRenderView;

})(PrototypeView);

IndexScroll = (function(_super) {
  __extends(IndexScroll, _super);

  function IndexScroll() {
    return IndexScroll.__super__.constructor.apply(this, arguments);
  }

  IndexScroll.prototype.init = function() {};

  IndexScroll.prototype.controller = function(opt) {
    var self;
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index-scroll");
    this.router = new indexScrollRouter;
    Backbone.history.start();
    self = this;
    this.el.find('header nav#menu li a[data-page]').click(function() {
      console.log("!" + $(this).attr('data-page'));
      self.router.navigate("!" + $(this).attr('data-page'), true);
      return false;
    });

    /* Если надо открывать каждый блок на всю страницу */
    app.onResize((function(_this) {
      return function(size) {
        return app.views.all.section.css({
          'min-height': size.windowHeight
        });
      };
    })(this));
    return $(window).trigger('resize');
  };

  return IndexScroll;

})(PrototypeView);

IndexHash = (function(_super) {
  __extends(IndexHash, _super);

  function IndexHash() {
    return IndexHash.__super__.constructor.apply(this, arguments);
  }

  IndexHash.prototype.init = function() {};

  IndexHash.prototype.controller = function(opt) {
    var self;
    this.opt = opt != null ? opt : {};
    this.el = $("main.view-index-hash");
    this.router = new indexHashRouter;
    Backbone.history.start();
    self = this;
    return this.el.find('header nav#menu li a[data-page]').click(function() {
      self.router.navigate("!" + $(this).attr('data-page'), true);
      return false;
    });
  };

  return IndexHash;

})(PrototypeView);


/* ============ Объявляем классы! =========== */

Views = (function() {
  function Views() {}

  Views.prototype.controller = function() {
    this.all = new allView;
    this.index = new IndexView;
    this.indexRender = new IndexRenderView;
    this.indexScroll = new IndexScroll;
    return this.indexHash = new IndexHash;
  };

  return Views;

})();
