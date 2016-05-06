jQuery(document).ready(function($){
	//open the lateral panel
	$('.cd-btn').on('click', function(event){
		event.preventDefault();
		$('.cd-panel').addClass('is-visible');
	});
	//close the lateral panel
	$('.cd-panel').on('click', function(event){
		if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) { 
			$('.cd-panel').removeClass('is-visible');
			event.preventDefault();
		}
	});
	var isLateralNavAnimating = false;
	
	//open/close lateral navigation
	$('.cd-nav-trigger').on('click', function(event){
		event.preventDefault();
		if( $('.cd-panel').hasClass('is-visible') ) { 
			$('.cd-panel').removeClass('is-visible');
			event.preventDefault();
		} else
		$('.cd-panel').addClass('is-visible');
		//stop if nav animation is running 
		if( !isLateralNavAnimating ) {
			if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true; 
			
			$('body').toggleClass('navigation-is-open');
			/*$('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				//animation is over
				isLateralNavAnimating = false;
			});
			*/
		}
	});	

});

var tabsFn = (function() {
  
  function init() {
    setHeight();
  }
  
  function setHeight() {
    var $tabPane = $('.tab-pane'),
        tabsHeight = $('.leftnav-tabs').height();
    
    $tabPane.css({
      height: tabsHeight
    });
  }
    
  $(init);
})();

$('.js-tdToggle').on('click', function(){
        if(window.innerWidth < 681){
            $(this).toggleClass("fa-plus-square fa-minus-square");
            var trParent = $(this).parent().parent();
            trParent.toggleClass("collapse expand");
        } else {
            $(this).toggleClass("fa-plus-square fa-minus-square");
            var tdParent = $(this).parent();
            tdParent.next("td").toggleClass("collapse expand");
        }   
    });