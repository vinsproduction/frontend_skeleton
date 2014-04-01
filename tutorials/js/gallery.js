var Gallery;

Gallery = (function() {
  function Gallery() {}

  Gallery.prototype.height = '100%';

  Gallery.prototype.width = '100%';

  Gallery.prototype.autoplay = 2000;

  Gallery.prototype.easing = 'easeOutExpo';

  Gallery.prototype.animateTime = 500;

  Gallery.prototype.paginationON = true;

  Gallery.prototype.controlsON = true;

  Gallery.prototype.thumbsON = true;

  Gallery.prototype.thumbsW = 600;

  Gallery.prototype.thumbW = 103;

  Gallery.prototype.thumbH = 103;

  Gallery.prototype.currentIndex = 1;

  Gallery.prototype.interval = null;

  Gallery.prototype.animate = false;

  Gallery.prototype.init = function(slides) {
    this.slides = slides;
    this.$gallery = $("#gallery");
    this.$preloader = $('#gallery-preloader');
    this.$controlPrev = $('#gallery-prev');
    this.$controlNext = $('#gallery-next');
    this.$controlPrev.hide();
    this.$controlNext.hide();
    this.$pagination = $('#gallery-pagination');
    this.$pagination.hide();
    this.$thumbsControlPrev = $('#gallery-thumbs-prev');
    this.$thumbsControlNext = $('#gallery-thumbs-next');
    this.$thumbsControlPrev.hide();
    this.$thumbsControlNext.hide();
    this.$gallery.html("<div class=\"wrapper\">\n	<div class=\"items\"></div>\n</div>");
    this.$wrapper = this.$gallery.find('.wrapper');
    this.$items = this.$gallery.find('.items');
    return $.each(slides, (function(_this) {
      return function(i, v) {
        var itemsCountLoaded, _self;
        _this.slides[i]['data-index'] = i;
        _this.$items.append("<div class=\"item\" data-index=\"" + i + "\">\n	<img src=\"" + v.image + "\" />\n</div>");
        if (i === _this.slides.length - 1) {
          _this.$items.prepend("<div class=\"item fish first\">\n	<img src=\"" + _this.slides[_this.slides.length - 1]['image'] + "\" />\n</div>");
          _this.$items.append("<div class=\"item fish last\">\n	<img src=\"" + _this.slides[0]['image'] + "\" />\n</div>");
          _this.$item = _this.$items.find('.item');
          _this.$img = _this.$item.find('img');
          _this.itemsCount = _this.$item.size();
          _self = _this;
          _this.$items.css({
            'visibility': 'hidden'
          });
          itemsCountLoaded = 0;
          return _this.$img.load(function() {
            itemsCountLoaded++;
            if (itemsCountLoaded === _self.itemsCount) {
              _self.$items.css({
                'visibility': 'visible'
              });
              _self.$preloader.hide();
              if (_self.controlsON) {
                _self.controls();
              }
              if (_self.paginationON) {
                _self.pagination();
              }
              if (_self.thumbsON) {
                _self.thumbs();
              }
              $(window).on("hashchange", function() {
                return _self.setSize(function() {
                  _self.goTo(0);
                  if (_self.autoplay) {
                    return _self.autoPlay();
                  }
                });
              });
              $(window).resize(function() {
                return _self.setSize(function() {
                  _self.goTo(0);
                  if (_self.autoplay) {
                    return _self.autoPlay();
                  }
                });
              });
              $(window).resize();
              $(window).on("DOMMouseScroll mousewheel", function(e) {
                var index;
                clearInterval(_self.interval);
                if (_self.animate) {
                  return;
                }
                if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                  index = _self.currentIndex >= _self.slides.length - 1 ? 0 : _self.currentIndex + 1;
                  return _self.goTo(index);
                } else {
                  index = _self.currentIndex <= 0 ? _self.slides.length - 1 : _self.currentIndex - 1;
                  return _self.goTo(index);
                }
              });
              return _self.load();
            }
          });
        }
      };
    })(this));
  };

  Gallery.prototype.load = function() {
    return console.log('gallery load!');
  };

  Gallery.prototype.resetSize = function() {
    var height;
    height = 0;
    this.$gallery.height(height);
    this.$items.height(height);
    this.$item.height(height);
    return this.$img.height(height);
  };

  Gallery.prototype.setSize = function(callback) {
    var height, width, _self;
    _self = this;
    this.resetSize();
    height = this.height === '100%' ? $(window).height() : this.height;
    height = height - this.thumbH - 20;
    this.$gallery.height(height);
    this.$items.height(height);
    this.$item.height(height);
    this.$img.height(height);
    width = this.width === '100%' ? $(window).width() : this.width;
    this.$gallery.width(width);
    if (_self.thumbsON) {
      this.setSizeThumbs();
    }
    this.itemsWidth = 0;
    $.each(this.$item, function(i) {
      var $img, w;
      $img = $(this).find('img');
      w = $img.width();
      $(this).width(w);
      _self.itemsWidth += w;
      if (i === _self.itemsCount - 1) {
        _self.$items.width(_self.itemsWidth);
        return _self.animatePositions(callback);
      }
    });
    return console.log('set size gallery constants:', this.width, this.height, 'set:', width, height);
  };

  Gallery.prototype.animatePositions = function(callback) {
    var gw, i, w, _i, _ref, _results;
    this.steps = [];
    w = this.$items.find(".item.fish.first img").width();
    gw = this.width === '100%' ? $(window).width() : this.width;
    this.steps.push(gw / 2 - this.$items.find(".item[data-index='0'] img").width() / 2 - w);
    _results = [];
    for (i = _i = 0, _ref = this.slides.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      w += this.$items.find(".item[data-index='" + i + "'] img").width();
      this.steps.push(gw / 2 - this.$items.find(".item[data-index='" + (i + 1) + "'] img").width() / 2 - w);
      if (i === this.slides.length - 2) {
        _results.push(callback());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Gallery.prototype.autoPlay = function() {
    var autoIndex;
    autoIndex = 0;
    clearInterval(this.interval);
    return this.interval = setInterval((function(_this) {
      return function() {
        if (autoIndex === _this.slides.length - 1) {
          autoIndex = 0;
        } else {
          autoIndex++;
        }
        return _this.goTo(autoIndex);
      };
    })(this), this.autoplay);
  };

  Gallery.prototype.build = function(index) {
    var _self;
    if (index == null) {
      index = 0;
    }
    _self = this;
    console.log("currentIndex -> " + index);
    this.currentIndex = parseInt(index);
    this.beforeAnimation();
    this.animate = true;
    return this.$items.addClass('speed').animate({
      left: this.steps[index]
    }, this.animateTime, this.easing, function() {
      _self.animate = false;
      $(this).removeClass('speed');
      return _self.afterAnimation();
    });
  };

  Gallery.prototype.beforeAnimation = function() {
    var index;
    if (this.thumbsON) {
      index = this.$current.attr('data-index');
      this.$thumbs.find('.item').removeClass('current');
      return this.$thumbs.find(".item[data-index='" + index + "']").addClass('current');
    }
  };

  Gallery.prototype.afterAnimation = function() {
    this.$item.removeClass('prev').removeClass('current').removeClass('next');
    this.$prev.addClass('prev');
    this.$current.addClass('current');
    return this.$next.addClass('next');
  };

  Gallery.prototype.controls = function() {
    var _self;
    _self = this;
    this.$controlNext.click((function(_this) {
      return function() {
        clearInterval(_self.interval);
        if (_self.animate) {
          return;
        }
        _this.goTo(_this.currentIndex + 1);
        return false;
      };
    })(this));
    this.$controlPrev.click((function(_this) {
      return function() {
        clearInterval(_self.interval);
        if (_self.animate) {
          return;
        }
        _this.goTo(_this.currentIndex - 1);
        return false;
      };
    })(this));
    this.$item.click(function() {
      clearInterval(_self.interval);
      if (_self.animate) {
        return;
      }
      if ($(this).is('.fish.first')) {
        return _self.goTo(_self.itemsCount - 3);
      } else if ($(this).is('.fish.last')) {
        return _self.goTo(0);
      } else {
        if ($(this).is('.current')) {
          return;
        }
        return _self.goTo(parseInt($(this).attr('data-index')));
      }
    });
    this.$controlPrev.show();
    return this.$controlNext.show();
  };

  Gallery.prototype.pagination = function() {
    var _self;
    _self = this;
    $.each(this.$item.not('.fish'), function() {
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

  Gallery.prototype.goTo = function(index) {
    var $findItem;
    if (index == null) {
      index = 0;
    }
    console.log("go to " + index);
    $findItem = this.$items.find(".item[data-index='" + index + "']");
    if ($findItem.size()) {
      this.$item.removeClass('prev').removeClass('current').removeClass('next');
      this.$prev = $findItem.prev();
      this.$current = $findItem;
      this.$next = $findItem.next();
      return this.build(index);
    }
  };

  Gallery.prototype.thumbs = function() {
    var _self;
    this.$thumbs = $('#gallery-thumbs');
    _self = this;
    this.$thumbs.append("<div class=\"items\" style=\"height:" + this.thumbH + "px;\"></div>");
    this.$thumbItems = this.$thumbs.find('.items');
    return $.each(this.slides, function(i, v) {
      var $thumb, imgSrc, indx, thumb;
      indx = v['data-index'];
      imgSrc = v.thumb;
      thumb = "<div class=\"item\" data-index=\"" + indx + "\">\n	<img src=\"" + imgSrc + "\" />\n</div>";
      $thumb = $(thumb);
      _self.$thumbItems.append($thumb);
      $thumb.height(_self.thumbH);
      $thumb.width(_self.thumbW);
      $thumb.find('img').css({
        height: _self.thumbH,
        width: _self.thumbW
      });
      if (i === _self.slides.length - 1) {
        _self.$thumbItem = _self.$thumbItems.find('.item');
        _self.setSizeThumbs();
        return _self.thumbs_controls();
      }
    });
  };

  Gallery.prototype.setSizeThumbs = function() {
    this.thumbsW = this.width === '100%' ? $(window).width() : this.width;
    this.$thumbs.width(this.thumbsW);
    this.$thumbs.height(this.thumbH);
    this.thumbItemsW = this.thumbW * this.$thumbItem.size();
    return this.$thumbItems.width(this.thumbItemsW);
  };

  Gallery.prototype.thumbs_controls = function() {
    var _self;
    _self = this;
    this.$thumbItem.click(function() {
      clearInterval(_self.interval);
      if (_self.animate) {
        return;
      }
      _self.goTo(parseInt($(this).attr('data-index')));
      return false;
    });
    this.$thumbsControlNext.click((function(_this) {
      return function() {
        var pos;
        clearInterval(_this.interval);
        if (_this.animate) {
          return;
        }
        pos = _this.$thumbItems.position().left - _this.thumbW;
        if (pos - _this.thumbsW + _this.thumbW >= -_this.thumbItemsW) {
          _this.$thumbItems.stop().animate({
            left: pos
          });
        }
        return false;
      };
    })(this));
    this.$thumbsControlPrev.click((function(_this) {
      return function() {
        var pos;
        clearInterval(_this.interval);
        if (_this.animate) {
          return;
        }
        pos = _this.$thumbItems.position().left + _this.thumbW;
        if (pos <= 0) {
          _this.$thumbItems.stop().animate({
            left: pos
          });
        }
        return false;
      };
    })(this));
    this.$thumbsControlPrev.show();
    return this.$thumbsControlNext.show();
  };

  return Gallery;

})();

window.gallery = new Gallery();
