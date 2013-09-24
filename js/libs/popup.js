// JavaScript Document
var popupStatus = 0;

//loading popup with jQuery magic!
function loadPopup(){
	if(popupStatus==0){
		$("#backgroundPopup").css({
			"opacity": "0.8"
		});
		$("#backgroundPopup").show();
		$("#popup").css({"visibility":"visible"});
		popupStatus = 1;
	}
}

function disablePopup(){
	if(popupStatus==1){
		$("#backgroundPopup").hide();
		$("#popup").css({"visibility":"hidden", "left":"-1000000px", "top":"-1000000px"});
		$("#popup .pop").removeClass('on');
		popupStatus = 0;
	}
}

function centerPopup(){
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#popup").height() + parseInt($("#popup").css('paddingTop')) + parseInt($("#popup").css('paddingBottom'));
	var popupWidth = $("#popup").width() + parseInt($("#popup").css('paddingLeft')) + parseInt($("#popup").css('paddingRight'));
	var windowScroll = $(window).scrollTop();
	var t = windowHeight/2-popupHeight/2 + windowScroll;
	if (t < 0) {
		t = 0;
	}

	$("#popup").css({
		"position": "absolute",
		"top": t,
		"left": $(window).width()/2-popupWidth/2
	});
}


// Функиця открытия конкретного попапа
// closeDisable -- true, если надо без кнопки
function openPopup(id, button, closeDisable, callback){
	
	$("div.pop").css({"position":"absolute", "visibility":"hidden", "left":"-1000000px", "top":"-1000000px"});
	$("#" + id).css({"position":"relative", "visibility":"visible", "left":"0px", "top":"0px"});
	$("#popup").css({"width":$("#" + id).width() + parseInt($("#" + id).css('paddingLeft')) + parseInt($("#" + id).css('paddingRight')) + parseInt($("#" + id).css('border-right-width')) + parseInt($("#" + id).css('border-right-width'))});
	$("#" + id).addClass('on');

	centerPopup();
	loadPopup();

	if(callback) callback();
	
	var $button = $("#"+id).find('[data-popup-button]');
	if( $button.size() ) $button.unbind('click');	
	
	if(button){						
		$button.click(function(event){
			if(typeof button == 'function'){							
				button();
			}else{				
				closePopup();
			}
			return false;
		});
	}
		
	if(closeDisable){
		$("[data-popup-close]").hide();
		
		$("#backgroundPopup").css({
			"opacity": "0.8"
		});
		$("#backgroundPopup").show();
		$("#popup").css({"visibility":"visible"});
		popupStatus = 0;
	}else{
		$("[data-popup-close]").show();
	}
	
	return false;
}

// кастомный попап для вывода любой	информации
// button -- если нужна кнопка OK, передается функция пост обработки нажатия или bool
// Например: customPopup('Необходимо авторизоваться', function() { openPopup($('#popup_register')) });

function customPopup(title, text, button, callback, closeDisable){
	
	var popupId = 'popup_custom';
	var $el = $("#"+popupId);

	var $button = $el.find('[data-popup-button]');
	
	if($button.size()) $button.unbind('click');	
			
	$el.find('.header h1').html(title);
	$el.find('.body').html(text);
	openPopup(popupId, ((button) ? true : false) );

	if(callback) callback();

	if(button){
		
		$button.click(function(event){
			if(typeof button == 'function'){							
				button();
			}else{				
				closePopup();
			}
			return false;
		});

		$button.show();	

	}else{		
		$button.hide();	
	}

	if(closeDisable){
		$("[data-popup-close]").hide();
		
		$("#backgroundPopup").css({
			"opacity": "0.8"
		});
		$("#backgroundPopup").show();
		$("#popup").css({"visibility":"visible"});
		popupStatus = 0;
	}else{
		$("[data-popup-close]").show();
	}

}

// Функция закрытия всех попапов
function closePopup(){	
	popupStatus = 1;
	disablePopup();
}



//CONTROLLING EVENTS IN jQuery
$(document).ready(function(){
	
	/*
	<a data-js="popup_my" href="#">Click me</a> OR
	<a data-js="popup_my" data-id="popup_my" href="#">Click me</a> 
	*/
	
	
	$("[data-popup-id]").click(function(){
		try {			
			var id = $(this).attr("data-popup-id");			
		}
		catch(err) {
			var id = $(this).attr("data-id");
		}
		openPopup(id);
		return false;
	});
	
	//Click out event!
	$("[data-popup-close]").click(function(){
		disablePopup();
		return false;
	});
	
	//Press Escape event!
	$(document).keypress(function(e){
		if(e.keyCode==27 && popupStatus==1){
			disablePopup();
		}
	});
});

$(window).resize(function(){
	if(popupStatus == 1){
		centerPopup();
	}
});