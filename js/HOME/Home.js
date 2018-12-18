var Home = function(main){

	var _this = this;
	_this.content = main;
    _this.elem;
    _this.init = function(elem){

	    _this.initStyle();

        _this.elem = elem;

        $.get("htmls/Home.html", function(html){


			var obj = $.parseHTML(html);
			var utente = $.getCookie("utente");

			$(obj).find(".menu, .thumbnail").each(function(){
				if(!$(this).hasClass(utente.ruolo)){
					$(this).remove();
				}else{
					$(this).css({display:"block"});
				}
			});


            _this.elem.html(obj);


			jQuery("#Home").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("Home", jQuery(this));
			});


			jQuery(".FormPonteggioSospeso").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("FormPonteggioSospeso", jQuery(this));
			});

			jQuery(".FormMontacarico").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("FormMontacarico", jQuery(this));
			});

			jQuery(".FormAscensore").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("FormAscensore", jQuery(this));
			});

			jQuery(".FormPonteggioElettrico").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("FormPonteggioElettrico", jQuery(this));
			});

			jQuery(".Carrello").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("Carrello",jQuery(this));
			});

			jQuery(".GestionePreventivi").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("Preventivi",jQuery(this));
			});

			jQuery(".GestioneUtenti").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("GestioneUtenti",jQuery(this));
			});

			jQuery(".Clienti").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("Clienti",jQuery(this));
			});

			jQuery(".Profilo").off().on("click",function(e){
				e.stopPropagation();
				_this.content.loadSezione("Profilo",jQuery(this));
			});

            _this.content.loader.remove();
        });
	}

	_this.initStyle = function() {
		//Nascondo la navbar
		$('.navbar-collapse').collapse('hide');
		//Coloro il li del menu
		$("#menu_prodotti").css("background-color", "#016eb6");
	}

}
