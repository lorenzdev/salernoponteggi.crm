var FormPonteggioSospeso = function(main){

	var _this = this;
	_this.main = main;
	_this.elem;

	_this.init = function(elem){

		_this.initStyle();

		_this.elem = elem;
		_this.main.appendScript("js/PONTEGGI_SOSPESI/PonteggioSospeso/PonteggioSospeso.js");

		$.get(P_PONTEGGI_SOSPESI, function(dataHtml){

			_this.elem.html(dataHtml);

			var obj = eval("new "+ "PonteggioSospeso" + "(_this)");
			obj.init($("#mask"));

			_this.main.loader.remove();

		});
	}

	_this.initStyle = function() {
		//Nascondo la navbar
		$('.navbar-collapse').collapse('hide');
		//Coloro il li del menu
		$("#menu_prodotti").css("background-color", "#fabd1b");
	}

}
