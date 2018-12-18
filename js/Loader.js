var Loader = function(){
	
	var _this = this;
	_this.busy = false;

	_this.init = function(func){
		
		_this.busy = true;
		
		if(jQuery(".blockUI").length <= 0){
		
			jQuery.blockUI({ css: { 
				border: 'none', 
				padding: '15px',
				left: (jQuery(window).width() - 200) /2 + 'px', 
				width: '200px',
				fontFamily: "Arial",
				backgroundColor: '#000', 
				'-webkit-border-radius': '10px', 
				'-moz-border-radius': '10px', 
				opacity: 0.4,
				color: '#fff',
				fontSize: "18px",
			}, message: "<i class=\"fa fa-spinner fa-spin\"></i> Attendere..."}); 
		
		}
		
		setTimeout(function(){func();},400);
		
	}
	
	_this.remove = function(){
		
		_this.busy = false;
		
		jQuery.unblockUI();
		
         $("input[type=text]").on("click", function(e){
                $(this).select();
            });
        
		/*jQuery("#Loader").fadeOut(function(){
				jQuery(this).remove();
		});
		*/
	}
	
	
	_this.setPosition = function(){
		var screenW = (window.innerHeight - jQuery("#boxLoader").innerWidth())/2;
		var screenH = (window.innerWidth - jQuery("#boxLoader").innerHeight())/2;
		
		jQuery("#bgLoader").css({width:window.innerWidth+"px"});
		jQuery("#bgLoader").css({height:(window.innerHeight+jQuery(document).scrollTop())+"px"});
			
		jQuery("#boxLoader").css({
		  position: "absolute",
		  top: jQuery(document).scrollTop() + (window.innerHeight-$('#boxLoader').height())/2,
		  left: (window.innerWidth-$('#boxLoader').width())/2
		});

	}
	
}