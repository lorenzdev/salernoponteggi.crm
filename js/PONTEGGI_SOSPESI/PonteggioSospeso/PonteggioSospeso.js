var PonteggioSospeso = function(content){

	var _this = this;
	_this.elem;
	_this.content = content;

	_this.initialize = function(){

		// REIMPOSTO LE FUNZIONALITA' DEI TASTI

	}

	_this.init = function(elem){
		_this.elem = elem;

		$.get(P_FORM_PONTEGGI_SOSPESI, function(dataHtml){
			_this.elem.html(dataHtml);
			_this.initButtons();
			_this.content.main.loader.remove();
		});
	}

	_this.initButtons = function() {

	}

}
