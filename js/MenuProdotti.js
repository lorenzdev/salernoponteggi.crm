// JavaScript Document

var MenuProdotti = function(main){

	var _this = this;
	_this.main = main;
	
	_this.init = function(){
		
		jQuery.get(P_MENU_PRODOTTI, function(datoHtml){
			jQuery("#menuProdotti").html(datoHtml);
			
			_this.main.loader.remove();
		});
	}
	
}