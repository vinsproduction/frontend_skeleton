var Carousel;

Carousel = (function() {
  Carousel.prototype.el = '#carousel';

  Carousel.prototype.height = 500;

  Carousel.prototype.width = 900;

  Carousel.prototype.itemHeight = 500;

  Carousel.prototype.itemWidth = 300;

  Carousel.prototype.start = 0;

  Carousel.prototype.autoplayON = false;

  Carousel.prototype.autoplayTime = 3000;

  Carousel.prototype.easing = 'easeOutExpo';

  Carousel.prototype.animateTime = 500;

  Carousel.prototype.paginationON = false;

  Carousel.prototype.controlsON = false;

  Carousel.prototype.load = function() {};

  Carousel.prototype.before = function(vars) {};

  Carousel.prototype.after = function(vars) {};

  Carousel.prototype.interval = null;

  Carousel.prototype.animate = false;

  function Carousel(options) {
    var k, v;
    for (k in options) {
      v = options[k];
      this[k] = v;
    }
    $((function(_this) {
      return function() {
        return _this.init();
      };
    })(this));
  }

  Carousel.prototype.init = function() {
    var _self;
    _self = this;
    this.$carousel = $(this.el);
    this.$controlPrev = $("" + this.el + "-prev");
    this.$controlNext = $("" + this.el + "-next");
    this.$controlPrev.hide();
    this.$controlNext.hide();
    this.$pagination = $("" + this.el + "-pagination");
    this.$pagination.hide();
    this.$items = this.$carousel.find('.items');
    this.$item = this.$items.find('>.item');
    this.itemsCount = this.$item.size();
    this.$carousel.css({
      'overflow': 'hidden'
    });
    this.$item.css({
      'overflow': 'hidden',
      'float': 'left'
    });
    this.$items.css({
      'position': 'relative'
    });
    return this.$item.each(function(i) {
      $(this).attr('data-index', i);
      if (i === _self.itemsCount - 1) {
        if (_self.controlsON) {
          _self.controls();
        }
        if (_self.paginationON) {
          _self.pagination();
        }
        _self.setSize();
        _self.goTo(_self.start);
        if (_self.autoplayON) {
          _self.autoplay();
        }
        return _self.load();
      }
    });
  };

  Carousel.prototype.setSize = function() {
    var _self;
    _self = this;
    this.$carousel.width(this.width);
    this.$carousel.height(this.height);
    this.$items.height(this.height);
    this.marginsH = parseInt(this.$item.css('padding-left')) + parseInt(this.$item.css('padding-right')) + parseInt(this.$item.css('margin-left')) + parseInt(this.$item.css('margin-right')) + parseInt(this.$item.css('border-left')) + parseInt(this.$item.css('border-right'));
    this.marginsV = parseInt(this.$item.css('padding-top')) + parseInt(this.$item.css('padding-bottom')) + parseInt(this.$item.css('margin-top')) + parseInt(this.$item.css('margin-bottom')) + parseInt(this.$item.css('border-top')) + parseInt(this.$item.css('border-bottom'));
    this.itemsWidth = 0;
    return this.$item.each(function(i) {
      var itemWidth;
      itemWidth = _self.itemWidth;
      _self.$item.width(itemWidth);
      _self.$item.height(_self.height - _self.marginsV);
      _self.itemsWidth += itemWidth + _self.marginsH;
      if (i === _self.itemsCount - 1) {
        return _self.$items.width(_self.itemsWidth);
      }
    });
  };

  Carousel.prototype.autoplay = function() {
    var autoIndex;
    autoIndex = 0;
    clearInterval(this.interval);
    return this.interval = setInterval((function(_this) {
      return function() {
        if (autoIndex === _this.itemsCount - 1) {
          autoIndex = 0;
        } else {
          autoIndex++;
        }
        return _this.goTo(autoIndex);
      };
    })(this), this.autoplayTime);
  };

  Carousel.prototype.build = function() {
    var diff, i, left, visibleIndexes, visibleWidth, _i, _ref, _ref1, _self;
    _self = this;
    if (this.itemsWidth <= this.width) {
      return this.afterAnimation();
    }
    visibleIndexes = [];
    visibleWidth = 0;
    diff = 0;
    for (i = _i = _ref = this.currentIndex, _ref1 = this.itemsCount; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
      if (visibleWidth <= this.width) {
        visibleIndexes.push(i);
      }
      visibleWidth += this.itemWidth + this.marginsH;
      if (visibleWidth >= this.width) {
        diff = Math.abs(this.width - visibleWidth);
        break;
      }
    }
    left = diff ? -(this.itemWidth + this.marginsH) * this.currentIndex : -(this.itemWidth + this.marginsH) * this.currentIndex + (this.width - (this.itemWidth + this.marginsH) * visibleIndexes.length);
    return this.animation(left);
  };

  Carousel.prototype.animation = function(left) {
    this.animate = true;
    return this.$items.addClass('speed').animate({
      left: left
    }, this.animateTime, this.easing, (function(_this) {
      return function() {
        _this.animate = false;
        _this.$items.removeClass('speed');
        return _this.afterAnimation();
      };
    })(this));
  };

  Carousel.prototype.beforeAnimation = function() {
    var vars;
    if (this.currentIndex === 0) {
      this.$controlPrev.hide();
    } else {
      this.$controlPrev.show();
    }
    if (this.currentIndex === this.itemsCount - 1) {
      this.$controlNext.hide();
    } else {
      this.$controlNext.show();
    }
    this.$item.removeClass('prev').removeClass('current').removeClass('next');
    this.$item.filter("[data-index=" + this.prevIndex + "]").addClass('prev');
    this.$item.filter("[data-index=" + this.currentIndex + "]").addClass('current');
    this.$item.filter("[data-index=" + this.nextIndex + "]").addClass('next');
    if (this.paginationON) {
      this.$pagination.find("a").removeClass('current');
      this.$pagination.find("a[data-index=" + this.currentIndex + "]").addClass('current');
    }
    vars = {
      prevIndex: this.prevIndex,
      currentIndex: this.currentIndex,
      nextIndex: this.nextIndex
    };
    return this.before(vars);
  };

  Carousel.prototype.afterAnimation = function() {
    var vars;
    vars = {
      prevIndex: this.prevIndex,
      currentIndex: this.currentIndex,
      nextIndex: this.nextIndex
    };
    return this.after(vars);
  };

  Carousel.prototype.controls = function() {
    var _self;
    _self = this;
    this.$controlNext.click((function(_this) {
      return function() {
        clearInterval(_self.interval);
        if (_self.animate) {
          return false;
        }
        _this.goTo(_this.currentIndex + 1);
        return false;
      };
    })(this));
    this.$controlPrev.click((function(_this) {
      return function() {
        clearInterval(_self.interval);
        if (_self.animate) {
          return false;
        }
        _this.goTo(_this.currentIndex - 1);
        return false;
      };
    })(this));
    this.$item.click(function() {
      clearInterval(_self.interval);
      if (_self.animate) {
        return false;
      }
      if ($(this).is('.current')) {
        return false;
      }
      return _self.goTo(parseInt($(this).attr('data-index')));
    });
    this.$controlPrev.show();
    return this.$controlNext.show();
  };

  Carousel.prototype.pagination = function() {
    var _self;
    _self = this;
    $.each(this.$item, function() {
      var $pag, itemId, pag;
      itemId = $(this).attr('data-index');
      pag = "<a href=\"#\" data-index=\"" + itemId + "\">" + itemId + "</a>";
      $pag = $(pag);
      $pag.click(function() {
        clearInterval(_self.interval);
        if (_self.animate) {
          return;
        }
        _self.goTo(parseInt($(this).attr('data-index')));
        return false;
      });
      return _self.$pagination.append($pag);
    });
    return this.$pagination.show();
  };

  Carousel.prototype.goTo = function(index) {
    var $findItem;
    if (index == null) {
      index = this.start;
    }
    this.scroll = index < this.currentIndex ? 'prev' : 'next';
    $findItem = this.$items.find(".item[data-index='" + index + "']");
    if ($findItem.size()) {
      console.log("[Carousel " + this.el + " > goTo] index: " + index + " scroll: " + this.scroll);
      this.$prev = $findItem.prev();
      this.prevIndex = this.$prev.size() ? parseInt(this.$prev.attr('data-index')) : 0;
      this.$current = $findItem;
      this.currentIndex = parseInt(index);
      this.$next = $findItem.next();
      this.nextIndex = this.$next.size() ? parseInt(this.$next.attr('data-index')) : this.itemsCount - 1;
      this.beforeAnimation();
      this.build();
      return $findItem;
    }
    return false;
  };

  return Carousel;

})();
