/* ---------------------------------------------
expandAll v.1.3.8.2
http://www.adipalaz.com/experiments/jquery/expand.html
Requires: jQuery v1.3+
Copyright (c) 2009 Adriana Palazova
Dual licensed under the MIT (http://www.adipalaz.com/docs/mit-license.txt) and GPL (http://www.adipalaz.com/docs/gpl-license.txt) licenses
------------------------------------------------ */
(function($) {



$.fn.expandAll = function(options) {
    var o = $.extend({}, $.fn.expandAll.defaults, options);   
    
    return this.each(function(index) {
        var $$ = $(this), $referent, $sw, $cllps, $tr, container, toggleTxt, toggleClass;
               
        // --- functions:
       (o.switchPosition == 'before') ? ($.fn.findSibling = $.fn.prev, $.fn.insrt = $.fn.before) : ($.fn.findSibling = $.fn.next, $.fn.insrt = $.fn.after);
                    
        // --- var container 
        if (this.id.length) { container = '#' + this.id;
        } else if (this.className.length) { container = this.tagName.toLowerCase() + '.' + this.className.split(' ').join('.');
        } else { container = this.tagName.toLowerCase();}
        
        // --- var $referent
        if (o.ref && $$.find(o.ref).length) {
          (o.switchPosition == 'before') ? $referent = $$.find("'" + o.ref + ":first'") : $referent = $$.find("'" + o.ref + ":last'");
        } else { return; }
        
        // end the script if the length of the collapsible element isn't long enough.  
        if (o.cllpsLength && $$.closest(container).find(o.cllpsEl).text().length < o.cllpsLength) {$$.closest(container).find(o.cllpsEl).addClass('dont_touch'); return;}
    
        // --- if expandAll() claims initial state = hidden:
        (o.initTxt == 'show') ? (toggleTxt = o.expTxt, toggleClass='') : (toggleTxt = o.cllpsTxt, toggleClass='open');
        if (o.state == 'hidden') { 
          $$.find(o.cllpsEl + ':not(.shown, .dont_touch)').hide().findSibling().find('> a.open').removeClass('open').data('state', 0); 
        } else {
          $$.find(o.cllpsEl).show().findSibling().find('> a').addClass('open').data('state', 1); 
        }
        
        (o.oneSwitch) ? ($referent.insrt('<p class="switch"><a href="#" class="' + toggleClass + '">' + toggleTxt + '</a></p>')) :
          ($referent.insrt('<p class="switch"><a href="#" class="">' + o.expTxt + '</a>&nbsp;|&nbsp;<a href="#" class="open">' + o.cllpsTxt + '</a></p>'));

        // --- var $sw, $cllps, $tr :
        $sw = $referent.findSibling('p').find('a');
        $cllps = $$.closest(container).find(o.cllpsEl).not('.dont_touch');
        $tr = (o.trigger) ? $$.closest(container).find(o.trigger + ' > a') : $$.closest(container).find('.expand > a');
                
        if (o.child) {
          $$.find(o.cllpsEl + '.shown').show().findSibling().find('> a').addClass('open').text(o.cllpsTxt);
          window.$vrbls = { kt1 : o.expTxt, kt2 : o.cllpsTxt };
        }

        var scrollElem;
        (typeof scrollableElement == 'function') ? (scrollElem = scrollableElement('html', 'body')) : (scrollElem = 'html, body');
        
        $sw.click(function() {
            var $switch = $(this),
                $c = $switch.closest(container).find(o.cllpsEl +':first'),
                cOffset = $c.offset().top - o.offset;
            if (o.parent) {
              var $swChildren = $switch.parent().nextAll().children('p.switch').find('a');
                  kidTxt1 = $vrbls.kt1, kidTxt2 = $vrbls.kt2,
                  kidTxt = ($switch.text() == o.expTxt) ? kidTxt2 : kidTxt1;
              $swChildren.text(kidTxt);
              if ($switch.text() == o.expTxt) {$swChildren.addClass('open');} else {$swChildren.removeClass('open');}
            }
            if ($switch.text() == o.expTxt) {
              if (o.oneSwitch) {$switch.text(o.cllpsTxt).attr('class', 'open');}
              $tr.addClass('open').data('state', 1);
              $cllps[o.showMethod](o.speed);
            } else {
              if (o.oneSwitch) {$switch.text(o.expTxt).attr('class', '');}
              $tr.removeClass('open').data('state', 0);
              if (o.speed == 0 || o.instantHide) {$cllps.hide();} else {$cllps[o.hideMethod](o.speed);}
              if (o.scroll && cOffset < $(window).scrollTop()) {$(scrollElem).animate({scrollTop: cOffset},600);}
          }
          return false;
        });
        /* -----------------------------------------------
        To save file size, feel free to remove the following code if you don't use the option: 'localLinks: true'
        -------------------------------------------------- */
        if (o.localLinks) { 
          var localLink = $(container).find(o.localLinks);
          if (localLink.length) {
            // based on http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links:
            $(localLink).click(function() {
              var $target = $(this.hash);
              $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
              if ($target.length) {
                var tOffset = $target.offset().top;
                $(scrollElem).animate({scrollTop: tOffset},600);
                return false;
              }
            });
          }
        }
        /* -----------------------------------------------
        Feel free to remove the following function if you don't use the options: 'localLinks: true' or 'scroll: true'
        -------------------------------------------------- */
        //http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links:
        function scrollableElement(els) {
          for (var i = 0, argLength = arguments.length; i < argLength; i++) {
            var el = arguments[i],
                $scrollElement = $(el);
            if ($scrollElement.scrollTop() > 0) {
              return el;
            } else {
              $scrollElement.scrollTop(1);
              var isScrollable = $scrollElement.scrollTop() > 0;
              $scrollElement.scrollTop(0);
              if (isScrollable) {
                return el;
              }
            }
          };
          return [];
        }; 
      /* --- end of the optional code --- */
});};
$.fn.expandAll.defaults = {
        state : 'hidden', // If 'hidden', the collapsible elements are hidden by default, else they are expanded by default 
        initTxt : 'show', // 'show' - if the initial text of the switch is for expanding, 'hide' - if the initial text of the switch is for collapsing
        expTxt : '[Expand All]', // the text of the switch for expanding
        cllpsTxt : '[Collapse All]', // the text of the switch for collapsing
        oneSwitch : true, // true or false - whether both [Expand All] and [Collapse All] are shown, or they swap
        ref : '.expand', // the switch 'Expand All/Collapse All' is inserted in regards to the element specified by 'ref'
        switchPosition: 'before', //'before' or 'after' - specifies the position of the switch 'Expand All/Collapse All' - before or after the collapsible element
        scroll : false, // false or true. If true, the switch 'Expand All/Collapse All' will be dinamically repositioned to remain in view when the collapsible element closes
        offset : 20,
        showMethod : 'slideDown', // 'show', 'slideDown', 'fadeIn', or custom
        hideMethod : 'slideUp', // 'hide', 'slideUp', 'fadeOut', or custom
        speed : 600, // the speed of the animation in m.s. or 'slow', 'normal', 'fast'
        cllpsEl : '.collapse', // the collapsible element
        trigger : '.expand', // if expandAll() is used in conjunction with toggle() - the elements that contain the trigger of the toggle effect on the individual collapsible sections
        localLinks : null, // null or the selector of the same-page links to which we will apply a smooth-scroll function, e.g. 'a.to_top'
        parent : false, // true, false
        child : false, // true, false
        cllpsLength : null, //null, {Number}. If {Number} (e.g. cllpsLength: 200) - if the number of characters inside the "collapsible element" is less than the given {Number}, the element will be visible all the time
        instantHide : false // {true} fixes hiding content inside hidden elements
};

/* ---------------------------------------------
Toggler v.1.0
http://www.adipalaz.com/experiments/jquery/expand.html
Requires: jQuery v1.3+
Copyright (c) 2009 Adriana Palazova
Dual licensed under the MIT (http://www.adipalaz.com/docs/mit-license.txt) and GPL (http://www.adipalaz.com/docs/gpl-license.txt) licenses
------------------------------------------------ */
$.fn.toggler = function(options) {
    var o = $.extend({}, $.fn.toggler.defaults, options);
    
    var $this = $(this);
    $this.wrapInner('<a style="display:block" href="#" title="Expand/Collapse" />');
    if (o.initShow) {$(o.initShow).addClass('shown');}
    $this.next(o.cllpsEl + ':not(.shown)').hide();
    return this.each(function() {
      var container;
      (o.container) ? container = o.container : container = 'html';
      if ($this.next('div.shown').length) { $this.closest(container).find('.shown').show().prev().find('a').addClass('open'); }
      $(this).click(function() {
        $(this).find('a').toggleClass('open').end().next(o.cllpsEl)[o.method](o.speed);
        return false;
    });
});};
$.fn.toggler.defaults = {
     cllpsEl : 'div.collapse',
     method : 'slideToggle',
     speed : 'slow',
     container : '', //the common container of all groups with collapsible content (optional)
     initShow : '.shown' //the initially expanded sections (optional)
};
/* ---------------------------------------------
Feel free to remove any of the following functions if you don't need it.
------------------------------------------------ */
//credit: http://jquery.malsup.com/fadetest.html
$.fn.fadeToggle = function(speed, callback) {
    return this.animate({opacity: 'toggle'}, speed, function() { 
    if (jQuery.browser.msie) { this.style.removeAttribute('filter'); }
    if (jQuery.isFunction(callback)) { callback(); }
  }); 
};
$.fn.slideFadeToggle = function(speed, easing, callback) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, function() { 
    if (jQuery.browser.msie) { this.style.removeAttribute('filter'); }
    if (jQuery.isFunction(callback)) { callback(); }
  }); 
};
$.fn.slideFadeDown = function(speed, callback) { 
  return this.animate({opacity: 'show', height: 'show'}, speed, function() { 
    if (jQuery.browser.msie) { this.style.removeAttribute('filter'); }
    if (jQuery.isFunction(callback)) { callback(); }
  }); 
}; 
$.fn.slideFadeUp = function(speed, callback) { 
  return this.animate({opacity: 'hide', height: 'hide'}, speed, function() { 
    if (jQuery.browser.msie) { this.style.removeAttribute('filter'); }
    if (jQuery.isFunction(callback)) { callback(); }
  }); 
  
}; 
/* --- end of the optional code --- */
 
})(jQuery);





















$(function() {
$("a.newwindow").attr("target","_blank");
$('a.lightbox').lightBox({fixedNavigation:true});


		$( "#accordion" ).accordion({autoHeight:false, navigation: true,collapsible: true});
		
	var currentPosition = 0;
	var slideWidth = 560;
	var slides = $('.slide');
	var numberOfSlides = slides.length;
	

	$("div.ui-accordion li a").removeClass("current");
	$("div.ui-accordion li").find("a").each(function(){
		//if( location.href.indexOf(this.location.href) != -1) {
		if((location.pathname.split('/')[location.pathname.split('/').length-1]) == (this.pathname.split('/')[this.pathname.split('/').length-1])){//(location.href.indexOf(this.href) != -1) {
		$(this).addClass("current");
		$('.bgMenu2').parent().addClass('active');
		}
	
	});     
	
	//for top menu current
	

    	var url = window.location.pathname, 
        urlRegExp = new RegExp(url.replace(/\/$/,'') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
        // now grab every link from the navigation
        $('li.topmenuli a').each(function(){
            // and test its normalized href against the url pathname regexp
            if(urlRegExp.test(this.href.replace(/\/$/,''))){
                $(this).parent().addClass('active');
            }
        });
        
        
        
        
      //for blog-inner-menu current   
       $("ul.blog-archive-list li a").removeClass("current");
	$("ul.blog-archive-list li").find("a").each(function(){
		if( location.href.indexOf(this.href) != -1) {
		//if((location.pathname.split('/')[location.pathname.split('/').length-1]) == (this.pathname.split('/')[this.pathname.split('/').length-1])){//(location.href.indexOf(this.href) != -1) {
		$(this).addClass("current");
		$('.bgMenu4').parent().addClass('active');
		}

	});   

	
	
	
	
	//$("li.topmenuli").removeAttr("id");
	//$("li.topmenuli").find("a").each(function(){
	//	if((location.pathname.split('/')[location.pathname.split('/').length-1]) == (this.pathname.split('/')[this.pathname.split('/').length-1])){
		//  $(this).parent().attr('id','current');	
		//}
			
	//});  
	
	
	
	
	
	
	
	
	
  
//if ($("#slideshow").exist()) {};    // Do something}


	// Remove scrollbar in JS .
  $('#slidesContainer').css('overflow', 'hidden');

  // Wrap all .slides with #slideInner div
  slides
  .wrapAll('<div id="slideInner"></div>')
  // Float left to display horizontally, readjust .slides width
  .css({
    'float' : 'left',
    'width' : slideWidth
  });

  // Set #slideInner width equal to total width of all slides
  $('#slideInner').css('width', slideWidth * numberOfSlides);

  // Insert left and right arrow controls in the DOM
  $('#slideshow')
    .prepend('<span class="control" id="leftControl">Move left</span>')
    .append('<span class="control" id="rightControl">Move right</span>');

  // Hide left arrow control on first load
  manageControls(currentPosition);

  // Create event listeners for .controls clicks
  $('.control')
    .bind('click', function(){
    // Determine new position
      currentPosition = ($(this).attr('id')=='rightControl')
    ? currentPosition+1 : currentPosition-1;

      // Hide / show controls
      manageControls(currentPosition);
      // Move slideInner using margin-left
      $('#slideInner').animate({
        'marginLeft' : slideWidth*(-currentPosition)
      });
  })
  
  
  
//};










 // manageControls: Hides and shows controls depending on currentPosition
  function manageControls(position){
    // Hide left arrow if position is first slide
    if(position==0){ $('#leftControl').hide() }
    else{ $('#leftControl').show() }
    // Hide right arrow if position is last slide
    if(position==numberOfSlides-1){ $('#rightControl').hide() }
    else{ $('#rightControl').show() }
  };   
  
});  

















