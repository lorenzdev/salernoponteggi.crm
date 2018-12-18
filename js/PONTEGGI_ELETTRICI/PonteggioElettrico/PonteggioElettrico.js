var PonteggioElettrico = function(content){

	var _this = this;
	_this.elem;
	_this.content = content;

	_this.initialize = function(){

		// REIMPOSTO LE FUNZIONALITA' DEI TASTI

	}

	_this.init = function(elem){
		_this.elem = elem;

		$.get(P_FORM_PONTEGGI_ELETTRICI, function(dataHtml){
			_this.elem.html(dataHtml);
			_this.initButtons();
			_this.content.main.loader.remove();
		});
	}

	_this.initButtons = function() {

		$("#btnCarrello").bind("click", function(){
			$.Log("Cliccato continua");
		});

		$("#btnPreventivo").bind("click", function(){
			$.Log("Cliccato resetta");
		});

		$("#mantovana").bind("click", function(){
			if($(this).is(":checked")) {
				$("#altezza_mantovana").css("display", "");
			} else {
				$("#altezza_mantovana").css("display", "none");
			}
		});

		$(".modelli").bind("click", function(){
			var modello = $(this).val();
		});


	}

}
