/* 
 * jQuery Lightly (v0.2)
 * http://getlightly.com
 * 
 * Copyright 2011, Steve Pocklington, Marty Batten
 * Inspired by Reeder App http://reederapp.com/mac/screens
 * 
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * June 2011
 */

(function($){
	
	// Private functions	
	function _ltly_supportsRGBA()
	{
		if(!('result' in arguments.callee))
		{
			var scriptElement = document.getElementsByTagName('script')[0];
			var prevColor = scriptElement.style.color;
			var testColor = 'rgba(0, 0, 0, 0.5)';
			if(prevColor == testColor)
			{
				arguments.callee.result = true;
			}
			else
			{
				try {
					scriptElement.style.color = testColor;
				} catch(e) {}
				arguments.callee.result = scriptElement.style.color != prevColor;
				scriptElement.style.color = prevColor;
			}
		}
		return arguments.callee.result;
	}
	
	function _ltly_preload(image, callback, loading)
	{
		// Show loading icon
		loading('show');
		
		// Preload image
		$('<img/>').hide().attr({'src':image}).load(function() {
			if ($.isFunction(callback))
			{
				loading('hide');
				callback.call(this);
			}
		});
	}
	
	// Plugin
	$.fn.lightly = function(options) {
		
		var settings = {
			'backgroundColor'	: '0,0,0',
			'backgroundOpacity'	: '0.5'
		};
		
		var $overlayDiv = null;
		var RGBA = _ltly_supportsRGBA();
		
		var $loadingDiv = null;
		var loadingTimer;
		var loadingFrame = 1;
		var $loading = function(action) {
			if (!$loadingDiv) {
				$loadingDiv = $('<div/>').attr('id','lightly-loading').appendTo($(document.body));
			}
			
			if (action == 'show')
			{
				$loadingDiv.css("top", (($(window).height() - $loadingDiv.outerHeight()) / 2) + $(window).scrollTop() + "px");
				$loadingDiv.css("left", (($(window).width() - $loadingDiv.outerWidth()) / 2) + $(window).scrollLeft() + "px");
				
				clearInterval(loadingTimer);
				$loadingDiv.fadeIn(200);
				loadingTimer = setInterval(function() {
					
					if (!$loadingDiv.is(':visible')){
						clearInterval(loadingTimer);
						return;
					}
					
					$loadingDiv.css('background-position', '0px ' + (loadingFrame * -40) + 'px');
					
					loadingFrame = (loadingFrame + 1) % 12;
					
				}, 66);
			}
			else if (action == 'hide')
			{
				$loadingDiv.hide();
			}
		}
		
		return this.each(function() {
			
			if (options) {
				$.extend(settings, options);
			}
			
			$(this).bind('click', function(e) {
				
				$link = $(this);
				
				var visible = false;
				var $overlay = function() {
					if (!$overlayDiv) {
						$overlayDiv = $('<div/>').attr('id','lightly-overlay').appendTo($(document.body));
						
						$overlayDiv.click(function() {
							
							if (RGBA)
							{
								$overlay().css({
									opacity:0,
									'-webkit-transform':'scale(1.1)',
									'-moz-transform':'scale(1.1)',
									'-ms-transform':'scale(1.1)',
									'-o-transform':'scale(1.1)',
									'transform':'scale(1.1)'
								});
							}
							
							setTimeout(function() {
								$overlay().hide();
							},200);
						});
					}
					return $overlayDiv;
				}
				
				var img = $link.attr('href');
				
				_ltly_preload(img, function() {
					$overlay().css({'background-image':'url('+img+')'});
					if (!visible) {
						$overlay()
							.removeClass('animate')
							.css({
								'-webkit-transform':'scale(0.5)',
								'-moz-transform':'scale(0.5)',
								'-ms-transform':'scale(0.5)',
								'-o-transform':'scale(0.5)',
								'transform':'scale(0.5)'
							});
							
						if (RGBA)
						{
							$overlay().css({'background-color':'rgba('+settings.backgroundColor+',0)', opacity:0});
						}
						$overlay().show();
						
						setTimeout(function() {
							$overlay().addClass('animate');
							if (RGBA)
							{
								$overlay()
									.css({
										'-webkit-transform':'scale(1.05)',
										'-moz-transform':'scale(1.05)',
										'-ms-transform':'scale(1.05)',
										'-o-transform':'scale(1.05)',
										'transform':'scale(1.05)',
										opacity:1
									});
							}
							setTimeout(function() {
								$overlay().css({
									'-webkit-transform':'scale(1)',
									'-moz-transform':'scale(1)',
									'-ms-transform':'scale(1)',
									'-o-transform':'scale(1)',
									'transform':'scale(1)'
								});
								setTimeout(function() {
									$overlay().css({'background-color':'rgba('+settings.backgroundColor+','+settings.backgroundOpacity+')'});
								});
							},200);
						},10);
					}
				}, $loading);
				
				return false;
				
			});
			
		});
		
	 };
	 
})( jQuery );