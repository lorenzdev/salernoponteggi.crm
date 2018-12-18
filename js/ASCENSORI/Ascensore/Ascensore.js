var Ascensore = function(content) {

	var _this = this;
	_this.elem;
	_this.content = content;

	// LORENZO: il cookie_carrello meglio così->
	_this.cookie_carrello = {
		"quantita": 1,
		"sconto": 0,
		"um":"",
		"optionals": [],
		"articolo": {
			"tipologia": "Ascensore",
			"modello": "PT300M",
			"altezza": 10.50,
			"componenti": "",
			"prezzo_base": 15001.59,
			"prezzo_con_componenti": 15001.59,
		},
		"prezzo_totale": 15001.59,
		"prezzo_totale_scontato": 15001.59
	}

	//LORENZO
	_this.abortGetOptionals;
	_this.prezzo_temp;

	_this.initialize = function() {
		// REIMPOSTO LE FUNZIONALITA' DEI TASTI
	}

	_this.init = function(elem) {
		_this.elem = elem;

		$.get(P_FORM_ASCENSORI, function(dataHtml) {
			_this.elem.html(dataHtml);
			_this.initButtons();
			_this.initModelli();
			_this.initAltezze();
			_this.getOptionals();
			_this.calcolaPrezzi();
		});
	}

	_this.initButtons = function() {

		$("#btnCarrello").off().on("click", function() {
			_this.aggiungiAlCarrello();
		});

		$("#btnPreventivo").off().on("click", function() {
			_this.salvaPreventivo();
		});

		$('.checkbox_optional').off().on("click", function() {
			_this.calcolaPrezzi();
		});

		$("#sconto").off();

		$("#sconto").on("click", function() {
			//LORENZO: quando clicco in sconto selezionare il contenuto
			$(this).select();
		});

		$("#sconto").on("keypress", function(e) {
			//LORENZO: quando clicco in sconto selezionare il contenuto
			return jQuery.onlynumbers(e);
		});

		$("#sconto").on("keyup", function() {
			_this.calcolaPrezzi();
		});

		// LORENZO: occhio qui. Prima faccio off e poi metto i due eventi (come era prima l'evento keyup toglieva l'evento keypress)
		$("#quantita").off();

		$("#quantita").on("click", function() {
			//LORENZO: quando clicco in sconto selezionare il contenuto
			$(this).select();
		});

		$("#quantita").on("keypress", function(e) {
			return jQuery.onlynumbers(e);
		});

		$("#quantita").on("keyup", function() {
			var quantita = $(this).val();
			if (quantita <= 0) return;
			_this.calcolaPrezzi();
		});

		$('.modelli').off().on("click", function() {
			$("#rows_optional").html("");
			var modello = $(this).val();
			_this.cookie_carrello.articolo.modello = modello;
			//_this.cleanOptions();
			_this.getOptionals();
		});

		//LORENZO: applicato un off().on() all'evento change così da innescarlo una sola volta
		$("#select_altezza").off().on("change", function() {
			var selected = $("#select_altezza > option:selected");
			var prezzo = $(selected).data("prezzo");
			var componenti = $(selected).data("componenti");
			_this.cookie_carrello.articolo.componenti = componenti;
			_this.cookie_carrello.articolo.altezza = selected.val();
			_this.cookie_carrello.articolo.prezzo_con_componenti = prezzo;
			_this.cookie_carrello.prezzo_totale = _this.cookie_carrello.articolo.prezzo_con_componenti;
			_this.cleanOptions();
			_this.calcolaPrezzi();
		});

	}

	_this.initModelli = function() {

		var param = {
			"param": ""
		};

		function callbackgetModelli(dato) {

			$.Log("Qui invoco il meodoto getModelli");
			$.Log(dato);

			_this.oggetto = dato.results;

			if (!dato.success) {
				alert("Errore nell'ottenimento delle altezze");
				return;
			}

			for (var i = 0; i < _this.oggetto.length; i++) {
				var modello = _this.oggetto[i].codice;

				if (i == 0) {

					var prezzo = _this.oggetto[i].prezzo;
					_this.cookie_carrello.articolo.modello = modello;
					_this.cookie_carrello.articolo.prezzo_base = prezzo;

					var tmp = '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-4">\
				   			   <label>\
				   				   <input value="' + modello + '" type="radio" name="modelli" class="modelli" checked>\
				   				   		<a class="thumbnail box_color">\
				   							<img src="img/space.png" alt="">\
				   						</a>\
				   					<p class="pagination-centered"><b>' + modello + '</b></p>\
				   				</label>\
				   			</div>';
				} else {
					var tmp = '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-4">\
				   			   <label>\
				   				   <input value="' + modello + '" type="radio" name="modelli" class="modelli">\
				   				   		<a class="thumbnail box_color">\
				   							<img src="img/space.png" alt="">\
				   						</a>\
				   					<p class="pagination-centered"><b>' + modello + '</b></p>\
				   				</label>\
				   			</div>';
				}

				var obj = $.parseHTML(tmp);
				$("#tabellaModelli").append(obj);
			}

		}

		$.postJSON("Ascensore", "getModelli", "private", param, false, callbackgetModelli);
	}

	_this.initAltezze = function() {

		var param = {
			"modello": _this.cookie_carrello.articolo.modello
		}

		function callbackgetAltezze(dato) {

			$.Log("Invoco il metodo getAltezze");
			$.Log(dato);
			var componenti = dato.results;
			//$.Log(componenti[keys[0]]["[traliccio]"]);

			if (!dato.success) {
				alert("Errore nell'ottenimento delle altezze");
				return;
			}

			if (componenti.length > 0) {

				for (var i = 0; i < componenti.length; i++) {

					if (i == 0) {
						var tmp = '<option selected="selected">' + componenti[i].altezza + '</option>';
						_this.cookie_carrello.articolo.prezzo_con_componenti = componenti[i].prezzo;
						_this.cookie_carrello.prezzo_totale = _this.cookie_carrello.articolo.prezzo_con_componenti;
						_this.cookie_carrello.articolo.componenti = componenti[i].descrizione;
					} else {
						var tmp = '<option>' + componenti[i].altezza + '</option>';
					}

					var obj = $.parseHTML(tmp);
					$(obj).data("componenti", componenti[i].descrizione);
					$(obj).data("prezzo", componenti[i].prezzo);
					$("#select_altezza").append(obj);

					_this.initButtons();
				}
			}
		}

		$.postJSON("Ascensore", "getAltezze", "private", param, false, callbackgetAltezze);
	}

	_this.getOptionals = function() {

		// LORENZO: nel caso in cui c'è una chiamata ajax sulle componenti faccio l'abort
		if (_this.abortGetOptionals) _this.abortGetOptionals.abort();

		// LORENZO: inserisco la rotellina in rows_optionals
		$("#rows_optional").html("<center><i class=\"fa fa-spinner fa-spin fa-3x fa-fw\"></i><span class=\"sr-only\">Loading...</span></center>");

		var param = {
			"modello": _this.cookie_carrello.articolo.modello
		}

		function callbackgetOptionals(dato) {

			//LORENZO: tolgo la rotellina da rows_optional
			$("#rows_optional").html("");

			var oggetto = dato.results;

			if (!dato.success) {
				alert("Errore nell'ottenimento delle altezze");
				return;
			}

			for (var i = 0; i < oggetto.length; i++) {
				var tmp = '<div class="checkbox checkbox-primary">\
							<input type="checkbox" id="' + oggetto[i].componente + '" class="checkbox_optional">\
							<label for="' + oggetto[i].componente + '">' + oggetto[i].descrizione + '</label>\
						</div>';

				var obj = $.parseHTML(tmp);
				$(obj).data("codice", oggetto[i].componente);
				$(obj).data("descrizione", oggetto[i].descrizione);
				$(obj).data("prezzo", oggetto[i].prezzo);
				$(obj).data("um", oggetto[i].um);
				$("#rows_optional").append(obj);
				//$.Log($(".checkbox_optional").parent().data("value"));
			}

			_this.initButtons();
		}

		//LORENZO: ritardo la chiamata ajax al metodo getComponenti così c'è qualche millesimo di secondo per mostrare la rotellina
		setTimeout(function() {
			// LORENZO: mi faccio restituire dalla chiamata ajax un riferimento così da poterla abortire eventualmente
			_this.abortGetOptionals = $.postJSON("Ascensore", "getOptionals", "private", param, true, callbackgetOptionals);
		}, 50);

	}

	_this.salvaPreventivo = function() {

		_this.addOptionals();

		
		/*		
		var riferimento = $("#riferimento").val();

		
		if (riferimento.length < 1) {
			alert("Inserire riferimento");
			return;
		}
		*/
		
		var param = {
			"descrizione": JSON.stringify(_this.cookie_carrello),
			"totale": _this.cookie_carrello.prezzo_totale,
			"totale_scontato": _this.cookie_carrello.prezzo_totale_scontato,
			"sconto":_this.cookie_carrello.sconto,
			"um":_this.cookie_carrello.um,
			//"riferimento": riferimento,
			"quantita": _this.cookie_carrello.quantita
		}

		$.Log(param);

		function callBackPreventivo(dato) {

			if (!dato.success) {
				alert("Errore inserimento del preventivo");
				return;
			}
		}

		jQuery.postJSON("Preventivi", "salvaPreventivoDaArticolo", "private", param, false, callBackPreventivo);
		_this.content.main.loadSezione("Preventivi", $(".GestionePreventivi"));

	}

	_this.aggiungiAlCarrello = function() {

		var id = new Date().getTime();

		_this.addOptionals();

		/*
		var riferimento = $("#riferimento").val();

		if (riferimento.length < 1) {
			alert("Inserire riferimento");
			return;
		}
		*/
		
		var param = {
			"id": id,
			"descrizione": JSON.stringify(_this.cookie_carrello),
			"totale": _this.cookie_carrello.prezzo_totale,
			"totaleScontato": _this.cookie_carrello.prezzo_totale_scontato,
			"um": _this.cookie_carrello.um,
			"sconto": _this.cookie_carrello.sconto,
			//"riferimento": riferimento,
			"quantita": _this.cookie_carrello.quantita,
			"prezzo_definitivo": 0
		}

		$.Log(param);

		function callbackCarrello(dato) {

			$.Log("ERRORE???");
			$.Log(dato);

			if (!dato.success) {
				alert(dato.messageError);
				return;
			}
		}

		jQuery.postJSON("Preventivi", "addProdottoToCarrello", "private", param, false, callbackCarrello);
		_this.content.main.loadSezione("Carrello", $(".Carrello"));
	}

	_this.calcolaPrezzi = function() {
		var quantita = Number($("#quantita").val());
		var sconto = Number($("#sconto").val());

		if(quantita <= 0)
			quantita = 1;

		// aggiorno i prezzi dell'articolo
		var totaleConComponentiArticolo = Number(_this.cookie_carrello.articolo.prezzo_con_componenti);
		_this.cookie_carrello.articolo.quantita = quantita;
		_this.cookie_carrello.articolo.sconto = sconto;
		_this.cookie_carrello.articolo.totale = quantita*totaleConComponentiArticolo;
		_this.cookie_carrello.articolo.totale_scontato = quantita*totaleConComponentiArticolo* (1 - sconto/100);

		_this.cookie_carrello.quantita = quantita;
		_this.cookie_carrello.sconto = sconto;

		var totale = _this.cookie_carrello.articolo.totale;
		var totale_scontato = 0;

		//Sommo il prezzo degli optionals
		$(".checkbox_optional").each(function() {
			if ($(this).prop("checked")) {
				var prezzo = $(this).parent().data("prezzo");
				$.Log(prezzo);
				totale += parseFloat(prezzo);
			}
		});


		//Applico lo sconto
		totale_scontato = totale * (1 - (sconto / 100));
		
		_this.cookie_carrello.prezzo_totale = totale;
		_this.cookie_carrello.prezzo_totale_scontato = totale_scontato;

		$('#tot').text("");
		$('#tot').text(totale.format(true, 2));

		$('#totScontato').text("");
		$('#totScontato').text(totale_scontato.format(true, 2));
	}

	_this.addOptionals = function() {
		_this.cookie_carrello.optionals = [];
		$(".checkbox_optional").each(function() {
			if ($(this).prop("checked")) {
				var optional = {
					"codice": $(this).parent().data("codice"),
					"descrizione": $(this).parent().data("descrizione"),
					"prezzo": $(this).parent().data("prezzo"),
					"um": $(this).parent().data("um"),
					"sconto": _this.cookie_carrello.sconto,
					"quantita": 1,
					"prezzo_scontato": Number($(this).parent().data("prezzo"))*(1 - Number(_this.cookie_carrello.sconto)/100)
				}
				_this.cookie_carrello.optionals.push(optional);
			}
		});
	}

	_this.cleanOptions = function() {
		$('.checkbox_optional').each(function() {
			$(this).removeAttr("checked");
		});
	}
}
