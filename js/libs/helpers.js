/*  HELPERS  */

var
__helpers__ = {}, // ORIGINAL NAMESPACE
$$; // SHORT NAMESPACE EDITABLE


(function($){
	
	$$ = __helpers__; // SHORT NAMESPACE

	$.disableConsole = function(){
		window.console = {
			log: function(){},
			debug: function(){},
			warn: function(){},
			info: function(){},
			error: function(){}
		};	
	};

	if( !window.console ) {
		$.disableConsole();
	}
	else if (!window.console.debug) { window.console.debug = function(){}; }
	else if (!window.console.log) 	{ window.console.log = function(){}; }
	else if (!window.console.warn) 	{ window.console.warn = function(){}; }
	else if (!window.console.info) 	{ window.console.info = function(){}; }
	else if (!window.console.error) 	{ window.console.error = function(){}; }


	$.log = function(obj) { 
		console.log(obj);
	};
		
	$.jlog = function(obj) { 

		if( !window.JSON  || !window.JSON.hasOwnProperty('stringify') ) {
			window.JSON = { stringify: function(){} };
		}			
		return window.JSON.stringify(obj); 
	};
	
	/* INCLUDE JAVASCRIPT FILE
	EXAMPLE IncludeJavaScript('/js/helpers.js'); */
	$.includeJS = function(jsFile) { return window.document.write('<script type="text/javascript" src="' + jsFile + '"></scr' + 'ipt>'); };
	/* INCLUDE CSS FILE
	EXAMPLE IncludeJavaScript('/css/helpers.css'); */
	$.includeCSS = function(file) { return window.document.write('<link rel="stylesheet" href="' + file + '" />');};

	/* BROWSER */
	
	$.userAgent = navigator.userAgent.toLowerCase();

	$.browser = {
		version: ($.userAgent.match( /.+(?:me|ox|on|rv|it|era|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
		opera: /opera/i.test($.userAgent),
		msie: (/msie/i.test($.userAgent) && !/opera/i.test($.userAgent)),
		msie6: (/msie 6/i.test($.userAgent) && !/opera/i.test($.userAgent)),
		msie7: (/msie 7/i.test($.userAgent) && !/opera/i.test($.userAgent)),
		msie8: (/msie 8/i.test($.userAgent) && !/opera/i.test($.userAgent)),
		msie9: (/msie 9/i.test($.userAgent) && !/opera/i.test($.userAgent)),
		mozilla: /firefox/i.test($.userAgent),
		chrome: /chrome/i.test($.userAgent),
		safari: (!(/chrome/i.test($.userAgent)) && /webkit|safari|khtml/i.test($.userAgent)),
		iphone: /iphone/i.test($.userAgent),
		ipod: /ipod/i.test($.userAgent),
		iphone4: /iphone.*OS 4/i.test($.userAgent),
		ipod4: /ipod.*OS 4/i.test($.userAgent),
		ipad: /ipad/i.test($.userAgent),
		android: /android/i.test($.userAgent),
		bada: /bada/i.test($.userAgent),
		mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile/i.test($.userAgent),
		msie_mobile: /iemobile/i.test($.userAgent),
		safari_mobile: /iphone|ipod|ipad/i.test($.userAgent),
		opera_mobile: /opera mini|opera mobi/i.test($.userAgent),
		mac: /mac/i.test($.userAgent)
	};

	/* EXAMPLE
	   getDate('d/m-y h:i') 
	   result: 28/03-2012 2:26
	*/
	$.date = function(format, date) {
		
	    var currentTime, day, dayZ, hours, hoursZ, minutes, minutesZ, month, monthName, monthNameShort, monthZ, seconds, secondsZ, year;
	    if (date == null) {
	      date = null;
	    }
	    currentTime = date ? new Date(date) : new Date();
	    month = currentTime.getMonth() + 1;
	    day = currentTime.getDate();
	    year = currentTime.getFullYear();
	    hours = currentTime.getHours();
	    minutes = currentTime.getMinutes();
	    seconds = currentTime.getSeconds();
	    monthName = new Array("января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря");
	    monthNameShort = new Array("янв", "фев", "мар", "апр", "мая", "июня", "июл", "авг", "сен", "окт", "ноя", "дек");
	    dayZ = (day < 10 ? "0" + day : day);
	    minutesZ = (minutes < 10 ? "0" + minutes : minutes);
	    secondsZ = (seconds < 10 ? "0" + seconds : seconds);
	    monthZ = (month < 10 ? "0" + month : month);
	    hoursZ = (hours < 10 ? "0" + hours : hours);
	    if (format) {
	      return format.replace("d", dayZ).replace("j", day).replace("m", monthZ).replace("n", month).replace("MS", monthNameShort[month - 1]).replace("M", monthName[month - 1]).replace("y", year).replace("h", hours).replace("H", hoursZ).replace("i", minutesZ).replace("s", seconds);
	    } else {
	      return dayZ + "-" + monthZ + "-" + year + " " + hoursZ + ":" + minutesZ + ":" + secondsZ;
	    }
  	};


	$.trim = function (text) { return (text || '').replace(/^\s+|\s+$/g, ''); };
	$.nl2br = function(str) { return str.replace(/([^>])\n/g, '$1<br/>'); };
	
	$.rand = function(mi, ma) { return Math.random() * (ma - mi + 1) + mi; };
	$.irand = function(mi, ma) { return Math.floor(rand(mi, ma)); };
	
	$.isFunction = function(obj) {return Object.prototype.toString.call(obj) === '[object Function]'; };
	$.isString = function(obj) { return Object.prototype.toString.call(obj) === '[object String]'; };
	$.isArray = function(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; };
	$.isObject = function(obj) { return Object.prototype.toString.call(obj) === '[object Object]'; };
	
	$.isEmpty = function(o){
		if( $.isString(o) ) {return ($.trim(o) ===  "") ? true : false;}
		if( $.isArray(o) )  {return (o.length === 0) ? true : false;}
		if( $.isObject(o) ) {for(var i in o){ if(o.hasOwnProperty(i)){return false;} } return true; }
	};

	$.stripHTML = function(text) { return text ? text.replace(/<(?:.|\s)*?>/g, '') : ''; };
	$.escapeHTML = function(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
	$.escapeRE = function(s) { return s ? s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1') : ''; };


	/* Склонение числительных 
	   declOfNum(5, ['секунда', 'секунды', 'секунд']) 
	*/
	$.declOfNum = function(number, titles){  
		var cases = [2, 0, 1, 1, 1, 2];  
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	};


	/* Парсинг урла
		напр. ?debug=test -> вернет test
	 */
  	$.urlParam = function(name) {
	    var results;
	    results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results && results[1]) {
	      return results[1];
	    } else {
	      return false;
	    }
  	};



	/* Масштабирование изображения по центру внутри элемента */

	$.imageCenter = function(el,zoom,w,h,wrapper) {

		$el = jQuery(el)

		$wrapper = $el.parent();

		if ($wrapper.css('position') != 'relative' && $wrapper.css('position') != 'absolute'){
			$wrapper.css({
				'position': 'relative',
			});
		}
	
		$wrapper.css({
			'overflow': 'hidden'
		});
		
		$el.css({'position': 'absolute'});

		if(!w){
			w = parseInt($wrapper.css('width')); 
		}else{
			if(wrapper){ $wrapper.width(w); }
		}

		if(!h){
			h = parseInt($wrapper.css('height'));
		}else{
			if(wrapper){ $wrapper.height(h); }
		}

		// Если нужен Zoom (замостить всю область фрейма картинкой!)
		if(zoom) {

			// Если фрейм горизонтальный
			if (w > h) {

				$el.width(w);
			   $el.css({
			   	left: 0,
					top: h/2 - $el.height()/2,
				});
			// Если фрейм квадратный
			}else if (w == h) {
				 // Если картинка горизонтальная
				if ($el.width() > $el.height()) {

				   $el.height(h);
				   $el.css({
				   	top: 0,
						left: w/2 - $el.width()/2,
					});			  
				 // Если картинка квадратная
				}else if($el.width() == $el.height()){
					$el.width(w);
					$el.height(h);
					$el.css({
						left: 0,
						top: 0
					});			   
			  	} else {
			  		$el.width(w);
			    	$el.css({
			    		left: 0,
				      top: h/2 - $el.height()/2.5,
				   });
			  	}
			// Если фрейм вертикальный
			}else{
				$el.height(h);
				$el.css({
		     		left: w/2 - $el.width()/2,
		     		top: 0
		    	});
			}
			return
		}


	    // Если картинка горизонтальная
		if ($el.width() > $el.height()) {
			// Если ширина картинки больше чем фрейм, то фиксируем
			if($el.width() > w) $el.width(w);
		// Если картинка квадратная
		}else if ($el.width() == $el.height()){
			// Если фрейм горизонтальный
			if (w > h) {
				// Если высота картинки больше чем фрейм, то фиксируем
				if($el.height() > h) $el.height(h);
			// Если фрейм квадратный
			}else if (w == h) {
				if($el.width() > w) $el.width(w);
				if($el.height() > h) $el.height(h);
			// Если фрейм вертикальный
			}else{
				// Если ширина картинки больше чем фрейм, то фиксируем
				if($el.width() > w) $el.width(w);
			}
		// Если картинка вертикальная
		}else{
			// Если высота картинки больше чем фрейм, то фиксируем
			if($el.height() > h) $el.height(h);
		}
		return $el.css({
     		top: (h/2 - $el.height()/2),
     		left: (w/2 - $el.width()/2)
    	});
	};



	/* Блокирование инпутов
	Example: onkeydown="if (!validField('digit',event)) return false" */

	$.validField = function(rule, event) {
		var evt;
		if (rule == 'digit') {
			evt = event || window.event;
			return ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)) || evt.keyCode === 8;
		}
	};


	/* PLACEHOLDER FOR FORM INPUTS  
	use: $$.placeholder($('input[name="name"]'),'Имя');
	*/
	$.placeholder = function(element,value){
		element.focus(function(){
			if(element.val() === value) element.val('');         
		}).
		blur(function(){
			if(element.val() === '') element.val(value);
		});

		element.blur();
	};

	
})(__helpers__);

	
/*  HELPERS  END */







