var Video;

Video = (function() {
  Video.prototype.width = 1000;

  Video.prototype.wrapperWidth = 1000;

  Video.prototype.wrapperHeight = 500;

  Video.prototype.fullscreen = false;

  Video.prototype.poster = false;

  Video.prototype.autoplay = true;

  Video.prototype.preload = true;

  Video.prototype.loop = true;

  Video.prototype.controls = false;

  Video.prototype.valume = 0.5;

  Video.prototype.startTime = 0;

  Video.prototype._isLoad = 0;

  Video.prototype._metaDataloaded = false;

  function Video(opt) {
    var k, v;
    if (opt == null) {
      opt = {};
    }
    for (k in opt) {
      v = opt[k];
      this[k] = v;
    }
    this._width = this.width = this.width;
    this._height = this.height = this.width * 9 / 16;
    this._wrapperWidth = this.wrapperWidth;
    this._wrapperHeight = this.wrapperHeight;
    $((function(_this) {
      return function() {
        return _this.init();
      };
    })(this));
  }

  Video.prototype.init = function() {
    this.Player = videojs("player", {
      'width': 'auto',
      'height': 'auto',
      "controls": this.controls,
      "preload": this.preload,
      "loop": this.loop,
      'techOrder': $$.browser.msie ? ['flash'] : ['html5', 'flash'],
      'poster': this.poster
    });
    this.wrapperEl = $('#video');
    this.playerEl = $("#player");
    this.videoEl = $("#player video");
    this.orignalWidth = this.playerEl.width();
    if (this.fullscreen) {
      this.mode = "fullscreen";
      this.fullScreen();
    } else {
      this.mode = "normalscreen";
      this.normalScreen();
    }
    if (this.controls) {
      $('.vjs-control-bar').show();
    }
    if (this.poster) {
      $('.vjs-poster').show();
    }
    if (this.preload) {
      $('.vjs-loading-spinner').show();
    }
    this.Player.on("pause", (function(_this) {
      return function() {};
    })(this));
    this.Player.on("play", (function(_this) {
      return function() {};
    })(this));
    this.Player.on("ended", (function(_this) {
      return function() {};
    })(this));
    if (this.autoplay) {
      this.play();
    }
    this.Player.ready((function(_this) {
      return function() {
        return console.debug('[Video] ready');
      };
    })(this));
    this.Player.on("loadedmetadata", (function(_this) {
      return function() {
        if (!_this._metaDataloaded) {
          console.debug('[Video] loadedmetadata');
          _this.Player.currentTime(_this.startTime);
          _this.Player.volume(_this.valume);
          return _this._metaDataloaded = true;
        }
      };
    })(this));
    this.Player.on("progress", (function(_this) {
      return function() {
        return _this._isLoad = Math.ceil(_this.Player.bufferedPercent() * 100);
      };
    })(this));
    return $(window).resize((function(_this) {
      return function() {
        if (_this.mode === "fullscreen") {
          return _this.fullScreen();
        }
      };
    })(this));
  };

  Video.prototype.resize = function() {
    this.wrapperEl.css({
      'width': this.wrapperWidth,
      'height': this.wrapperHeight
    });
    this.playerEl.css({
      'width': this.width,
      'height': this.height
    });
    this.videoEl.css({
      'top': this.wrapperHeight / 2 - this.height / 2,
      'left': this.wrapperWidth / 2 - this.width / 2,
      'width': this.width,
      'height': this.height
    });
    return $('.vjs-loading-spinner').css({
      'top': this.wrapperHeight / 2,
      'left': this.wrapperWidth / 2
    });
  };

  Video.prototype.fullScreen = function() {
    this.mode = 'fullscreen';
    console.log('[Video] mode', this.mode);
    this.wrapperWidth = $(window).width();
    this.wrapperHeight = $(window).height();
    if (this.wrapperHeight * 16 / 9 < this.wrapperWidth) {
      this.width = this.wrapperWidth;
      this.height = this.wrapperWidth * 9 / 16;
    } else {
      this.width = this.wrapperHeight * 16 / 9;
      this.height = this.wrapperHeight;
    }
    return this.resize();
  };

  Video.prototype.normalScreen = function() {
    this.mode = 'normalscreen';
    console.log('[Video] mode', this.mode);
    this.wrapperWidth = this._wrapperWidth;
    this.wrapperHeight = this._wrapperHeight;
    this.width = this._width;
    this.height = this._height;
    return this.resize();
  };

  Video.prototype.play = function() {
    return this.Player.play();
  };

  Video.prototype.stop = function() {
    this.Player.pause();
    return this.Player.currentTime(0);
  };

  Video.prototype.pause = function() {
    return this.Player.pause();
  };

  Video.prototype.mute = function(volume) {
    return this.Player.volume(volume);
  };

  Video.prototype.time = function(sec) {
    return this.Player.volume(sec);
  };

  return Video;

})();
