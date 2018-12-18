var FormAscensore = function(main){

	var _this = this;
	_this.main = main;
	_this.elem;

	_this.init = function(elem){

		_this.initStyle();
		_this.elem = elem;

		_this.main.appendScript("js/ASCENSORI/Ascensore/Ascensore.js");

		$.get(P_ASCENSORI, function(dataHtml){

			_this.elem.html(dataHtml);

			var obj = eval("new "+ "Ascensore" + "(_this)");
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
