
/* Карта этажей */
var Map;

jQuery.support.cors = true;

jQuery.ajaxSetup({
  cache: false,
  crossDomain: true
});

Map = (function() {
  Map.prototype.wrapperWidth = 660;

  Map.prototype.wrapperHeight = 564;

  Map.prototype.wrapperBgColor = '';

  Map.prototype.mapWidth = 924;

  Map.prototype.mapHeight = 790;

  Map.prototype.zoom = 0.7;

  Map.prototype.zoomMax = 1.5;

  Map.prototype.zoomStep = 0.1;

  Map.prototype.boxidColor = 'red';

  Map.prototype.boxidSize = '10px';

  Map.prototype.hilightColor = '00ffcc';

  Map.prototype.mapPosition = {
    top: 0,
    left: 0,
    _top: 0,
    _left: 0
  };

  Map.prototype.apiUrl = "";

  Map.prototype.root = "";

  Map.prototype.showIds = false;

  Map.prototype.showDoneShops = false;

  Map.prototype.floors = {
    'ocean': [-1, 0, 1, 2],
    'krasnodar': [-1, 1, 2, 3, 4],
    'novosib': [1, 2, 3, 4],
    'moremall': [-1, 1, 2, 3]
  };

  Map.prototype.showLayers = true;

  Map.prototype.layers = {
    'krasnodar': {
      '-1': ['escalator', 'wc'],
      '1': ['escalator', 'elevator', 'wc', 'information'],
      '2': ['escalator', 'elevator', 'wc'],
      '3': ['escalator', 'elevator', 'wc']
    },
    'novosib': {
      '1': ['escalator', 'elevator', 'wc', 'metro'],
      '2': ['escalator', 'elevator', 'wc'],
      '3': ['escalator', 'elevator', 'wc'],
      '4': ['wc']
    },
    'moremall': {
      '1': ['escalator', 'wc'],
      '2': ['escalator', 'wc'],
      '3': ['escalator', 'wc']
    },
    'ocean': {
      '-1': ['escalator', 'elevator'],
      '0': ['escalator', 'elevator', 'wc'],
      '1': ['escalator', 'elevator', 'wc', 'metro'],
      '2': ['escalator', 'elevator', 'wc']
    }
  };

  Map.prototype.areaColors = {
    '1': "299838",
    '2': "C91C00",
    '3': "248FD0",
    '4': "F5DC00",
    '5': "89462D",
    '6': "D899EB",
    '7': "F5DC00",
    '8': "CD0576",
    '9 ': "C9DFF2",
    '10': "FFF49A",
    '11': "B0D300",
    '12': "F57C75",
    '13': "0030FF",
    '14': "C7898D",
    '15': "436A9F",
    '16': "E46B00",
    '17': "E89700",
    '18': "2A108C",
    '19': "685B52",
    '20': "756500",
    '21': "3E3752",
    '22': "5AA1AB",
    '23': "BE8241",
    '24': "AEF1A5"
  };

  function Map(opt) {
    if (opt == null) {
      opt = {};
    }
    _.each(opt, (function(_this) {
      return function(v, k) {
        return _this[k] = v;
      };
    })(this));
    this.zoomMin = this.zoom;
    if (opt.zoom) {
      this.zoom = this.zoomMin = opt.zoom;
    }
    if (!opt.mapPosition) {
      opt.mapPosition = {};
    }
    if (opt.mapPosition.top != null) {
      this.mapPosition.top = this.mapPosition._top = opt.mapPosition.top;
    }
    if (opt.mapPosition.left != null) {
      this.mapPosition.left = this.mapPosition._left = opt.mapPosition.left;
    }
    this.init();
  }

  Map.prototype.init = function() {
    this.el = $('#shop-map');
    this.el.find('.wrapper').css({
      width: this.wrapperWidth,
      height: this.wrapperHeight,
      'background': this.wrapperBgColor
    });
    this.initZoom();
    return this.initActions();
  };

  Map.prototype.initZoom = function() {
    this.el.find('.plus').click((function(_this) {
      return function() {
        if (_this.zoom >= _this.zoomMax) {
          return;
        }
        _this.zoom += _this.zoomStep;
        _this.zoom = parseFloat(_this.zoom.toFixed(1));
        return _this.createMap();
      };
    })(this));
    return this.el.find('.minus').click((function(_this) {
      return function() {
        if (_this.zoom <= _this.zoomMin) {
          return;
        }
        _this.zoom -= _this.zoomStep;
        _this.zoom = parseFloat(_this.zoom.toFixed(1));
        return _this.createMap();
      };
    })(this));
  };

  Map.prototype.setZoom = function() {
    var bg, h, src, w;
    console.log('[Map > setZoom]', this.zoom);
    this.mapPosition.top = this.wrapperHeight / 2 - this.mapHeight * this.zoom / 2 + this.mapPosition._top;
    this.mapPosition.left = this.wrapperWidth / 2 - this.mapWidth * this.zoom / 2 + this.mapPosition._left;
    h = this.mapHeight * this.zoom;
    w = this.mapWidth * this.zoom;
    src = this.el.find('.map-image').attr('src');
    if ($$.browser.msie) {
      bg = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale');-ms-filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')";
    } else {
      bg = "background: url(" + src + ");background-size: 100%;";
    }
    this.el.find('.map-bg').attr('style', "display:block;position:relative;padding:0;" + bg);
    this.el.find('.map, .map canvas, .layers img, .map-bg, .map-image').css({
      'height': h,
      'width': w
    });
    this.el.find('.map-bg').css({
      'left': this.mapPosition.left,
      'top': this.mapPosition.top
    });
    return this.el.find('.map canvas').attr('height', h + 'px').attr('width', w + 'px');
  };

  Map.prototype.preloaderON = function() {
    this.el.find('.preloader').show();
    return this.el.find('.pl_min, .map').css('opacity', 0).css('filter', 'Alpha(opacity=0)');
  };

  Map.prototype.preloaderOFF = function() {
    this.el.find('.preloader').hide();
    return this.el.find('.pl_min, .map').css('opacity', 1).css('filter', 'none');
  };

  Map.prototype.areaClick = function(data) {
    return console.debug('[Map > area click!]', data);
  };

  Map.prototype.areaHover = function(data) {
    return console.debug('[Map > area hover!]', data);
  };

  Map.prototype.floorClick = function(data) {
    return console.debug('[Map > floor click!]', data);
  };

  Map.prototype.createCallback = function() {
    return console.debug('[Map > create!]', this);
  };

  Map.prototype.initActions = function() {
    var timeout, _self;
    _self = this;
    this.el.find('[data-layer]').click(function() {
      var el;
      _self.el.find('[data-layer]').not($(this)).removeClass('active');
      _self.el.find('[data-sale]').removeClass('active');
      _self.el.find('.layer.active').hide();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        $(this).addClass('active');
        el = _self.el.find(".layer.active[data-type=" + ($(this).attr('data-layer')) + "][data-shop=" + _self.shop + "][data-floor=" + _self.floor + "]");
        el.css({
          'display': 'block'
        });
        _self.offAllSale();
      }
      return false;
    });

    /* РАСПРОДАЖА */
    this.el.find('[data-sale]').click(function() {
      var findAreas, ids;
      _self.el.find('[data-layer]').removeClass('active');
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        _self.offAllSale();
      } else {
        $(this).addClass('active');
        findAreas = _.filter(_self.areas, function(area) {
          return area.sale === true;
        });
        ids = _.pluck(findAreas, 'id');
        _self.getAreasOverlay(ids);
        _self.el.find('.layer.active').hide();
      }
      return false;
    });

    /* ФИЛЬР ПО ТИПУ МАГАЗИНА */
    this.el.find('[data-type]').click(function() {
      var $a, findAreas, findType, ids;
      _self.el.find('.list li').removeClass('active');
      $a = $(this).find('a');
      _self.el.find('[data-type] a').not($a).removeClass('active');
      if (!$a.hasClass('active')) {
        $a.addClass('active');
        findType = $(this).attr('data-type');
        findAreas = _.filter(_self.areas, function(area) {
          return parseInt(area.type) === parseInt(findType);
        });
        ids = _.pluck(findAreas, 'id');
        _self.getAreas(ids);
      } else {
        $a.removeClass('active');
        _self.offAllPoly(true);
      }
      return false;
    });

    /* ПОИСК */
    timeout = null;
    return this.el.find('#findAreaByBrand').keypress(function(event) {
      _self.el.find('.list li').removeClass('active');
      if (event.keyCode === 13) {
        event.preventDefault();
        clearTimeout(timeout);
        _self.findBrandByName($(this).val());
        return false;
      }
    }).keyup(function() {
      clearTimeout(timeout);
      return timeout = setTimeout((function(_this) {
        return function() {
          return _self.findBrandByName($(_this).val());
        };
      })(this), 500);
    });
  };

  Map.prototype.getAreaCorners = function(coords) {
    var center, coord, coordsArray, i, l, maxX, maxY, minX, minY;
    coordsArray = coords.split(",");
    center = [];
    coord = void 0;
    minX = maxX = parseInt(coordsArray[0], 10);
    minY = maxY = parseInt(coordsArray[1], 10);
    i = 0;
    l = coordsArray.length;
    while (i < l) {
      coord = parseInt(coordsArray[i], 10);
      if (i % 2 === 0) {
        if (coord < minX) {
          minX = coord;
        }
        if (coord > maxX) {
          maxX = coord;
        }
      } else {
        if (coord < minY) {
          minY = coord;
        }
        if (coord > maxY) {
          maxY = coord;
        }
      }
      i++;
    }
    return [minX, maxX, minY, maxY];
  };

  Map.prototype.getAreaCenter = function(coords) {
    var center;
    coords = this.getAreaCorners(coords);
    center = {
      x: parseInt((coords[0] + coords[1]) / 2, 10),
      y: parseInt((coords[2] + coords[3]) / 2, 10)
    };
    return center;
  };

  Map.prototype.createMap = function() {
    var areaId, interval, _self;
    this.preloaderON();
    _self = this;
    this.el.find('.map').html("<img class=\"map-image\" usemap=\"#shop\" src=\"" + this.root + "images/maps/" + this.shop + "/" + this.floor + ".png\" width=\"" + this.mapWidth + "px\" height=\"" + this.mapHeight + "px\" />\n<map name=\"shop\"></map>");
    areaId = 1;
    _.each(window.SHAPES, function(v, k) {
      var $area, coords, coordsArr;
      coordsArr = [];
      _.each(v.curves[0], function(v, k) {
        coordsArr.push(v.x * _self.zoom);
        return coordsArr.push(v.y * _self.zoom);
      });
      coords = coordsArr.join(',');
      $area = $("<area data-area='" + areaId + "' href='#' coords='" + coords + "' maphilight='{}' shape='poly' >");
      _self.el.find('.map map').append($area);
      return areaId++;
    });
    this.el.find('.map-image').maphilight({
      fade: true,
      stroke: true,
      strokeOpacity: 1,
      strokeColor: this.hilightColor,
      fillOpacity: 0.6,
      fillColor: this.hilightColor,
      wrapClass: 'map-bg'
    });
    interval = setInterval((function(_this) {
      return function() {
        if (_this.el.find('.map-bg').size()) {
          _this.createMapCallback();
          return clearInterval(interval);
        }
      };
    })(this), 100);
  };

  Map.prototype.createMapCallback = function() {
    var _self;
    _self = this;
    if (this.showLayers) {
      this.el.find('.map-bg').prepend(this.layersEl);
      this.layersEl.show();
    }
    if (this.showIds) {
      this.idsLayer = $("<div class='ids'></div>");
      this.el.find('.map-bg').prepend(this.idsLayer);
    }
    this.setZoom();
    this.el.find('.movebox').css({
      left: 0,
      top: 0
    }).draggable();
    this.el.find('area').each(function() {
      var $boxidEl, area, areaId, center, data;
      areaId = parseInt($(this).attr('data-area'));
      data = $(this).data("maphilight") || {};
      center = _self.getAreaCenter($(this).attr('coords'));
      area = _.find(_self.areas, function(area) {
        return parseInt(area.id) === areaId;
      });
      $(this).click((function(_this) {
        return function() {
          _self.areaClick({
            areaId: areaId,
            area: area,
            position: center,
            shop: _self.shop,
            floor: _self.floor
          });
          if (area && area.url) {
            window.location.href = area.url;
          }
          return false;
        };
      })(this));
      $(this).mouseenter(function(e, fixed) {
        var $tooltip, content, tooltip;
        _self.areaHover({
          areaId: areaId,
          area: area,
          position: center,
          shop: _self.shop,
          floor: _self.floor
        });
        $('#tooltip-area').remove();
        _self.el.find('.map').unbind('mousemove');
        _self.el.find('.list li').removeClass('active');
        _self.offAllPoly();
        if (area || _self.showIds) {
          _self.el.find(".list li.shop-" + areaId).addClass('active');
          center = _self.getAreaCenter($(this).attr('coords'));
          if (_self.showIds) {
            content = areaId;
          } else {
            content = area.logo ? "<img src='" + area.logo + "' >" : area.name;
          }
          tooltip = "<div id=\"tooltip-area\" class=\"label " + (area.logo ? 'withlogo' : '') + "\">\n	<div class=\"tooltip-wrapper\">\n		<div class=\"tooltip-inner\">" + content + "</div>\n	</div>\n	<div class=\"tooltip-corner\"></div>\n</div>";
          $tooltip = $(tooltip);
          $tooltip.css({
            'top': center.y,
            'left': center.x
          });
          _self.el.find('.map-bg').prepend($tooltip);
          $(this).addClass('active');
          if (fixed) {
            if ($('#tooltip-area').size()) {
              $('#tooltip-area').css({
                'top': center.y,
                'left': center.x
              });
            }
          } else {
            _self.el.find('.map').unbind('mousemove').mousemove(function(e) {
              var left, top;
              if ($('#tooltip-area').size()) {
                top = e.pageY - $(this).offset().top - _self.mapPosition.top - 10;
                left = e.pageX - $(this).offset().left - _self.mapPosition.left;
                return $('#tooltip-area').css({
                  'top': top,
                  'left': left
                });
              }
            });
          }
          data = $(this).data("maphilight") || {};
          data.alwaysOn = true;
          if (_self.showDoneShops && $(this).hasClass('hold')) {
            data.fillColor = _self.doneColor;
          } else {
            data.fillColor = _self.hilightColor;
          }
          return $(this).data("maphilight", data).trigger('alwaysOn.maphilight');
        }
      }).mouseleave(function(e) {
        if (!$(this).hasClass('hold')) {
          _self.el.find('.list li').removeClass('active');
          data = $(this).data("maphilight") || {};
          data.fillColor = _self.hilightColor;
          data.alwaysOn = false;
          $(this).data("maphilight", data).trigger('alwaysOn.maphilight').removeClass('active');
        }
        $('#tooltip-area').remove();
        return _self.el.find('.map').unbind('mousemove');
      });

      /* показывать айдишники на полигонах */
      if (_self.showIds) {
        $boxidEl = $("<div class='boxid' style='position:absolute; font-size: " + _self.boxidSize + "; color: " + _self.boxidColor + ";'>" + ($(this).attr('data-area')) + "</div>");
        _self.idsLayer.append($boxidEl);
        $boxidEl.css({
          'top': center.y - $boxidEl.height() / 2,
          'left': center.x - $boxidEl.width() / 2
        });
      }

      /* Заполненные магазины */
      if (area && _self.showDoneShops) {
        data.fillColor = _self.doneColor;
        data.alwaysOn = true;
        $(this).addClass('active hold');
        return $(this).data("maphilight", data).trigger('alwaysOn.maphilight');
      }
    });
    if (this.shopid) {
      this.getArea(this.shopid);
      this.el.find(".map map area[data-area='" + this.shopid + "']").trigger('mouseenter', true);
    }
    this.preloaderOFF();
    return this.createCallback();
  };

  Map.prototype.showDone = function() {
    var _self;
    _self = this;
    return this.el.find('area').each(function() {
      var area, areaId, data;
      areaId = parseInt($(this).attr('data-area'));
      data = $(this).data("maphilight") || {};
      area = _.find(_self.areas, function(area) {
        return parseInt(area.id) === areaId;
      });

      /* Заполненные магазины */
      if (area && _self.showDoneShops) {
        data.fillColor = _self.doneColor;
        data.alwaysOn = true;
        $(this).addClass('active hold');
        return $(this).data("maphilight", data).trigger('alwaysOn.maphilight');
      }
    });
  };

  Map.prototype.findBrandByName = function(name) {
    var area;
    this.offAllPoly();
    area = _.find(this.areas, function(area) {
      return area.name.toLowerCase() === name.toLowerCase();
    });
    console.log("[Map > findBrandByName] '" + name + "' - ", area);
    if (area) {
      return this.getArea(area.id);
    }
  };

  Map.prototype.offAllPoly = function(withHold) {
    var _self;
    _self = this;
    if (withHold) {
      $('area.hold').removeClass('hold');
    }
    return $('area.active').each(function() {
      var data;
      if (!$(this).hasClass('hold')) {
        data = $(this).data("maphilight") || {};
        data.strokeColor = _self.hilightColor;
        data.fillColor = _self.hilightColor;
        data.alwaysOn = false;
        return $(this).data("maphilight", data).trigger('alwaysOn.maphilight').removeClass('active');
      }
    });
  };

  Map.prototype.getAreasOverlay = function(ids) {
    return _.each(ids, (function(_this) {
      return function(id) {
        var $area, $tooltip, area, center, tooltip;
        $area = $("area[data-area='" + id + "']");
        area = _.find(_this.areas, function(area) {
          return parseInt(area.id) === parseInt(id);
        });
        if ($area.size() && area) {
          console.log("[Map > getAreasOverlay]", area);
          tooltip = "<div class=\"tooltip-sale\" style=\"\n	position:absolute;\n	/*background:red;*/\n	background: url('" + _this.root + "images/sale_filter.png') no-repeat;\n	background-size: 100%;						\n\">\n</div>";
          center = _this.getAreaCenter($area.attr('coords'));
          $tooltip = $(tooltip);
          $tooltip.css({
            width: 25,
            height: 25,
            'top': center.y - 25 / 2,
            'left': center.x - 25 / 2
          });
          return $area.after($tooltip);
        }
      };
    })(this));
  };

  Map.prototype.offAllSale = function() {
    return this.el.find('.tooltip-sale').remove();
  };

  Map.prototype.getAreas = function(ids) {
    this.offAllPoly(true);
    return _.each(ids, (function(_this) {
      return function(id) {
        var $area, area, color, data;
        $area = $("area[data-area='" + id + "']");
        area = _.find(_this.areas, function(area) {
          return parseInt(area.id) === parseInt(id);
        });
        if ($area.size() && area) {
          console.log('[Map > getAreas]', area);
          $area.addClass('active');
          data = $area.data("maphilight") || {};
          color = _this.areaColors[area.type] || false;
          if ($area.hasClass('hold')) {
            data.fillColor = _this.hilightColor;
            data.strokeColor = _this.hilightColor;
            data.alwaysOn = false;
            $area.removeClass('hold');
          } else if (color) {
            data.fillColor = color;
            data.strokeColor = color;
            data.alwaysOn = true;
            $area.addClass('hold');
          }
          return $area.data("maphilight", data).trigger('alwaysOn.maphilight');
        }
      };
    })(this));
  };

  Map.prototype.getArea = function(id, hold) {
    var $area, area, data;
    $area = $("area[data-area='" + id + "']");
    area = _.find(this.areas, function(area) {
      return parseInt(area.id) === parseInt(id);
    });
    if ($area.size() && area) {
      if (hold) {
        $area.addClass('hold');
      }
      this.offAllPoly();
      this.el.find('.list li').removeClass('active');
      this.el.find(".list li.shop-" + id).addClass('active');
      $('#tooltip-area').remove();
      console.log('[Map > getArea]', area);
      $area.addClass('active');
      data = $area.data("maphilight") || {};
      data.fillColor = this.showDoneShops ? this.doneColor : this.hilightColor;
      data.alwaysOn = true;
      return $area.data("maphilight", data).trigger('alwaysOn.maphilight');
    }
  };

  Map.prototype.initMap = function(data) {
    var $floors, $list, urljs, _data;
    _data = {
      areas: []
    };
    if (!this.floor && this.floor !== 0) {
      this.floor = this.floors[this.shop][0];
    }
    _.each(data, (function(_this) {
      return function(v) {
        if (parseInt(v.floor) === parseInt(_this.floor)) {
          return _data.areas = v.areas;
        }
      };
    })(this));
    this.areas = _data.areas;
    if (_data.floors) {
      this.floors = _data.floors;
    }
    if (_data.layers) {
      this.layers = _data.layers;
    }
    $floors = this.el.find('.nav');
    $floors.empty();
    _.each(this.floors[this.shop], (function(_this) {
      return function(v, k) {
        return $floors.append("<li class=\"floor\" data-floor=\"" + v + "\" onclick=\"map.getMap('" + _this.shop + "'," + v + ");\"><a href=\"#tabs-" + v + "\">" + v + " этаж</a></li>");
      };
    })(this));
    $floors.find('.floor').removeClass('active');
    $floors.find(".floor[data-floor='" + this.floor + "']").addClass('ui-tabs-active');
    $list = this.el.find('.list');
    $list.empty();
    _.each(this.areas, (function(_this) {
      return function(v, k) {
        return $list.append("<li class=\"shop-" + v.id + "\" onclick=\"map.offAllPoly(true); map.getArea(" + v.id + ",true)\">" + v.name + " [id:" + v.id + "]</li>");
      };
    })(this));
    if (this.showLayers) {
      this.el.find('[data-layer]').removeClass('active').parent().hide();
      _.each(this.layers[this.shop][this.floor], (function(_this) {
        return function(type) {
          var layer;
          layer = "<img class=\"layer\" data-shop=\"" + _this.shop + "\" data-floor=\"" + _this.floor + "\" data-type=\"" + type + "\" src=\"" + _this.root + "images/maps/" + _this.shop + "/" + type + "_" + _this.floor + ".png\" style=\"position:absolute;display:block;\">\n<img class=\"layer active\" data-shop=\"" + _this.shop + "\" data-floor=\"" + _this.floor + "\" data-type=\"" + type + "\" src=\"" + _this.root + "images/maps/" + _this.shop + "/" + type + "_" + _this.floor + "_active.png\" style=\"position:absolute;display:none;\">";
          _this.layersEl.append($(layer));
          return _this.el.find("[data-layer='" + type + "']").parent().show();
        };
      })(this));
    }
    this.el.find('[data-sale]').removeClass('active').parent().hide();
    if (_.find(this.areas, function(area) {
      return area.sale === true;
    })) {
      this.el.find('[data-sale]').parent().show();
    }
    urljs = "" + this.root + "js/maps/" + this.shop + "/" + this.floor + ".js";
    console.debug("[Map > getScript]", urljs);
    return $.getScript(urljs, (function(_this) {
      return function() {
        _this.createMap();
        return false;
      };
    })(this));
  };

  Map.prototype.getMap = function(shop, floor, shopid) {
    this.shop = shop;
    this.floor = floor;
    this.shopid = shopid;
    this.preloaderON();
    this.zoom = this.zoomMin;
    if (this.showLayers) {
      if (this.el.find(".layers").size()) {
        this.layersEl = this.el.find(".layers");
      } else {
        this.layersEl = $("<div class='layers'></div>");
        this.el.append(this.layersEl);
      }
    }
    this.el.find('.map').empty();
    this.apiUrl += '?shop=' + this.shop;
    return $.getJSON(this.apiUrl).done((function(_this) {
      return function(data) {
        console.debug("[Map > getJSON from server]", _this.apiUrl, "done ->", data);
        return _this.initMap(data);
      };
    })(this));
  };

  return Map;

})();
